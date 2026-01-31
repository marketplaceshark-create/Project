// Path: frontend/app.js
var app = angular.module('userApp', []);

// ==========================================
// ⚙️ CONFIGURATION: CHANGE BACKEND URL HERE
// ==========================================
app.constant('API_CONFIG', {
    // Keep the trailing slash!
    //url: "https://fresh-clouds-call.loca.lt/" 
    url: "http://127.0.0.1:8000/" // Uncomment for local dev
});

// --- 0. FILE READER DIRECTIVE ---
app.directive('fileread', [function () {
    return {
        scope: { fileread: "=" },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                if (changeEvent.target.files[0]) {
                    reader.readAsDataURL(changeEvent.target.files[0]);
                }
            });
        }
    }
}]);

// --- 1. GLOBAL SESSION MANAGER & HELPERS ---
app.run(function($window, $rootScope, $timeout, API_CONFIG) {
    // Session Check
    $rootScope.checkSession = function() {
        var user = $window.sessionStorage.getItem('currentUser');
        try {
            $rootScope.currentUser = user ? JSON.parse(user) : null;
        } catch (e) {
            $rootScope.currentUser = null;
        }
    };

    $rootScope.logout = function() {
        $window.sessionStorage.clear();
        $rootScope.currentUser = null;
        $window.location.href = 'index.html';
    };

    // GLOBAL IMAGE HELPER (Uses API_CONFIG)
    $rootScope.getImageUrl = function(item) {
        if (!item) return null;
        
        // 1. Check if user uploaded a specific image, master image, or profile image exists
        var img = item.image || item.productImage || item.profile_image;
        if (!img) return null;
        
        // 2. If it's already a full URL (http/https), return as is
        if (img.startsWith('http')) return img;
        
        // 3. Otherwise, prepend backend URL from Config
        var baseUrl = API_CONFIG.url.endsWith('/') ? API_CONFIG.url.slice(0, -1) : API_CONFIG.url;
        var imgPath = img.startsWith('/') ? img : '/' + img;
        
        return baseUrl + imgPath;
    };

    // --- TOAST NOTIFICATION SYSTEM ---
    $rootScope.toasts = [];
    $rootScope.showToast = function(message, type) {
        // type: 'success', 'error', 'info'
        var newToast = { message: message, type: type || 'info', id: Date.now() };
        $rootScope.toasts.push(newToast);
        
        // Remove toast after 3 seconds
        $timeout(function() {
            var index = $rootScope.toasts.indexOf(newToast);
            if (index > -1) $rootScope.toasts.splice(index, 1);
        }, 3000);
    };

    $rootScope.checkSession();
});

// --- 2. MARKETPLACE CONTROLLER (HOME) ---
app.controller('MarketplaceCtrl', function ($scope, $http, $window, $q, API_CONFIG) {
    $scope.searchText = ""; 
    
    $scope.goToMarket = function() {
        $window.location.href = 'market.html?q=' + encodeURIComponent($scope.searchText);
    };

    $scope.openProduct = function(p) {
        $window.location.href = 'product_detail.html?id=' + p.id + '&type=' + p.type;
    };

    // --- WEATHER LOGIC (Open-Meteo API - Free, No Key) ---
    function loadWeather() {
        // Default to Nashik coordinates (Major Agri Hub in India)
        var lat = 19.9975;
        var lon = 73.7898;
        
        // URL for Open-Meteo
        var url = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon + "&current_weather=true&hourly=relativehumidity_2m,rain";
        
        $http.get(url).then(function(res) {
            var curr = res.data.current_weather;
            
            // Safe DOM manipulation for the widget if element exists
            var tempEl = document.getElementById('tempDisplay');
            if(tempEl) {
                tempEl.innerText = curr.temperature + "°C";
                document.getElementById('windDisplay').innerText = curr.windspeed + " km/h";
                
                // Simple mapping WMO codes to text
                var desc = "Clear Sky";
                if(curr.weathercode > 3) desc = "Cloudy";
                if(curr.weathercode > 50) desc = "Rainy";
                if(curr.weathercode > 70) desc = "Stormy";
                document.getElementById('descDisplay').innerText = desc;
                
                // Mocking humidity/rain probability from hourly data (taking first index)
                if(res.data.hourly) {
                    document.getElementById('humDisplay').innerText = res.data.hourly.relativehumidity_2m[0] + "%";
                    document.getElementById('rainDisplay').innerText = (res.data.hourly.rain[0] > 0 ? "High" : "Low");
                }
            }
        }, function(err) { console.log("Weather API error", err); });
    }

    // --- ANALYTICS CHART LOGIC ---
    $scope.initChart = function() {
        $http.get(API_CONFIG.url + "product/analytics/trends/").then(function(res) {
            var prices = res.data.prices; // Expecting [{ category__name: 'Veg', avg_price: 200 }, ...]
            
            var labels = prices.map(function(i) { return i.category__name; });
            var data = prices.map(function(i) { return i.avg_price; });
            
            var ctx = document.getElementById('priceChart');
            if(ctx && typeof Chart !== 'undefined') {
                // Destroy old chart if exists to prevent overlay
                if(window.myPriceChart) window.myPriceChart.destroy();

                window.myPriceChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Avg Market Price (₹)',
                            data: data,
                            backgroundColor: 'rgba(46, 125, 50, 0.6)',
                            borderColor: 'rgba(46, 125, 50, 1)',
                            borderWidth: 1,
                            borderRadius: 5
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                            y: { beginAtZero: true, grid: { borderDash: [5, 5] } }
                        }
                    }
                });
            }
        }, function(err) { console.log("Analytics API not available yet (check backend)."); });
    };

    // Initialize New Features
    loadWeather();
    // Use timeout to ensure DOM is ready for Chart
    setTimeout($scope.initChart, 500);

    var sellRequest = $http.get(API_CONFIG.url + "product_sell/");
    var buyRequest = $http.get(API_CONFIG.url + "product_buy/");

    $q.all([sellRequest, buyRequest]).then(function (results) {
        var sales = results[0].data.map(function(item) { item.type = 'sell'; return item; });
        var buys = results[1].data.map(function(item) { 
            item.type = 'buy';
            // FIX: If name is 'General', prefer the productName (e.g. Red Onion)
            var label = (item.name === 'General' && item.productName) ? item.productName : (item.name || item.productName || "General Item");
            item.productName = "Wanted: " + label;
            return item;
        });

        var allItems = sales.concat(buys);
        organizeProductsForHome(allItems);
    });

    function organizeProductsForHome(products) {
        var sections = [
            { id: 'veg', title: 'Fresh Vegetables', keywords: ['onion', 'potato', 'tomato', 'veg', 'carrot'], items: [] },
            { id: 'fruit', title: 'Organic Fruits', keywords: ['apple', 'mango', 'banana', 'fruit', 'grape'], items: [] },
            { id: 'grain', title: 'Grains & Pulses', keywords: ['rice', 'wheat', 'corn', 'maize', 'dal'], items: [] }
        ];

        products.forEach(function(p) {
            // Search in both Master Name and User Defined Name
            var name = (p.productName || "").toLowerCase() + " " + (p.name || "").toLowerCase();
            for (var i = 0; i < sections.length; i++) {
                if (sections[i].keywords.some(function(k) { return name.includes(k); })) {
                    sections[i].items.push(p);
                    break;
                }
            }
        });
        $scope.homeSections = sections;
    }
});

// --- 3. MARKET CONTROLLER (SEARCH PAGE) ---
app.controller('MarketCtrl', function ($scope, $http, $q, $window, API_CONFIG) {
    // 1. Initial State: 'sell' is selected by default
    $scope.filters = { type: 'sell', search: '', location: '' };
    $scope.locations = []; 
    $scope.allItems = [];
    $scope.filteredItems = [];

    var urlParams = new URLSearchParams(window.location.search);
    var categoryId = urlParams.get('category_id'); 
    var searchQuery = urlParams.get('q'); 
    if(searchQuery) $scope.filters.search = searchQuery;
    
    var config = {};
    if (categoryId) config.params = { category_id: categoryId };

    var sellReq = $http.get(API_CONFIG.url + "product_sell/", config);
    var buyReq = $http.get(API_CONFIG.url + "product_buy/", config);

    $q.all([sellReq, buyReq]).then(function(results) {
        var sales = results[0].data.map(function(i) { i.type = 'sell'; i.trusted = true; return i; });
        var buys = results[1].data.map(function(i) { 
            i.type = 'buy'; 
            
            // --- FIX FOR "GENERAL" NAME ISSUE ---
            // If master product exists (e.g. Red Onion), prefer that over "General".
            var displayLabel = (i.name === 'General' && i.productName) ? i.productName : (i.name || i.productName || "General");
            
            // Format the string for display
            i.productName = "Wanted: " + displayLabel;
            
            // Important: Set name to null if it's 'General' so the HTML {{item.name || item.productName}} 
            // fallback mechanism picks up our new fancy productName string.
            if(i.name === 'General') i.name = null;

            return i; 
        });

        $scope.allItems = sales.concat(buys);
        
        // Populate Location Filter
        var lSet = new Set();
        $scope.allItems.forEach(function(item) {
            if(item.location) lSet.add(item.location.trim());
        });
        $scope.locations = Array.from(lSet).sort();

        // FIX: Apply filters immediately so the list respects 'sell' selection on load
        $scope.applyFilters();
    });

    $scope.resetFilters = function() {
        $window.location.href = "market.html";
    };

    $scope.applyFilters = function() {
        var f = $scope.filters;
        var term = f.search.toLowerCase();

        $scope.filteredItems = $scope.allItems.filter(function(item) {
            // Filter by Type
            if (f.type !== 'all' && f.type && item.type !== f.type) return false;
            
            // Filter by Search (Master Name, User Name, Location)
            var nameStr = (item.productName || "") + " " + (item.name || "");
            
            var textMatch = (nameStr.toLowerCase().includes(term)) || 
                            (item.location && item.location.toLowerCase().includes(term));
            
            if (!textMatch) return false;
            
            // Filter by Location
            if (f.location && item.location !== f.location) return false;
            return true;
        });
    };

    $scope.openItem = function(item) {
        var typeParam = item.type === 'buy' ? '&type=buy' : '';
        $window.location.href = 'product_detail.html?id=' + item.id + typeParam;
    };
});

// --- 4. PRODUCT DETAIL CONTROLLER ---
app.controller('ProductDetailCtrl', function ($scope, $http, $window, $rootScope, API_CONFIG) {
    var urlParams = new URLSearchParams(window.location.search);
    var id = urlParams.get('id');
    var type = urlParams.get('type') || 'sell'; 

    $scope.bid = { quantity: 1, amount: "", message: "" }; 
    $scope.bids = [];
    $scope.isOwner = false;

    if (id) {
        var endpoint = (type === 'buy') ? "product_buy/" : "product_sell/";
        $http.get(API_CONFIG.url + endpoint + id + "/").then(function (res) {
            $scope.product = res.data;
            $scope.product.type = type;
            if ($rootScope.currentUser && $scope.product.customer == $rootScope.currentUser.id) {
                $scope.isOwner = true;
            }
            loadBids();
        });
    }

    function loadBids() {
        var param = (type === 'buy') ? "buy_id=" : "sell_id=";
        $http.get(API_CONFIG.url + "product_bid/?" + param + id).then(function(res){
             $scope.bids = res.data;
        });
    }

    $scope.placeBid = function() {
        if (!$rootScope.currentUser) {
            $rootScope.showToast("Please login to place a bid.", "error");
            window.location.href = "login.html";
            return;
        }
        if ($scope.isOwner) {
            $rootScope.showToast("You cannot bid on your own post.", "error");
            return;
        }
        var bidData = {
            bidder: $rootScope.currentUser.id,
            amount: $scope.bid.amount,
            quantity: $scope.bid.quantity,
            message: $scope.bid.message || "Interested",
            status: "PENDING"
        };
        if (type === 'buy') bidData.buy_post = id;
        else bidData.sell_post = id;

        $http.post(API_CONFIG.url + "product_bid/", bidData).then(function() {
            $rootScope.showToast("Bid Placed Successfully!", "success");
            $scope.bid = { quantity: 1, amount: "", message: "" }; // Reset form
            loadBids();
        }, function() { $rootScope.showToast("Error placing bid. Please try again.", "error"); });
    };

    $scope.updateBidStatus = function(bid, status) {
        $http.put(API_CONFIG.url + "product_bid/" + bid.id + "/", { status: status }).then(function() {
            bid.status = status;
        });
    };
});

// --- 5. CATEGORY PAGE ---
app.controller('CategoryPageCtrl', function ($scope, $http, $window, API_CONFIG) {
    $scope.categories = [];
    $http.get(API_CONFIG.url + "category/").then(function (res) {
        $scope.categories = res.data;
    });
    $scope.getCategoryIcon = function(name) {
        var n = (name || "").toLowerCase();
        if (n.includes("veg")) return "bi-flower3";
        if (n.includes("fruit")) return "bi-apple";
        if (n.includes("grain")) return "bi-cloud-haze2"; 
        return "bi-box-seam";
    };
    $scope.goToMarket = function(cat) {
        $window.location.href = 'market.html?category_id=' + cat.id;
    };
});

// --- 6. AUTH CONTROLLER (UPDATED FOR YOUR PASSWORD) ---
app.controller('AuthCtrl', function ($scope, $http, $window, $rootScope, API_CONFIG) {
    $scope.loginData = {};
    $scope.regData = {};
    $scope.showPassword = false; // State for Eye Icon

    // Toggle function for eye icon
    $scope.togglePassword = function() {
        $scope.showPassword = !$scope.showPassword;
    };

    $scope.loginCustomer = function () {
        $http.post(API_CONFIG.url + "customer/login/", $scope.loginData).then(function (res) {
            $window.sessionStorage.setItem('currentUser', JSON.stringify(res.data));
            $rootScope.showToast("Welcome back!", "success");
            $window.location.href = 'customer_dashboard.html';
        }, function() { $rootScope.showToast("Invalid Credentials", "error"); });
    };

    $scope.loginAdmin = function () {
        $http.post(API_CONFIG.url + "user/login/", $scope.loginData).then(function (res) {
            var admin = res.data; 
            admin.role = 'admin';
            $window.sessionStorage.setItem('currentUser', JSON.stringify(admin));
            $window.location.href = 'admin_dashboard.html';
        }, function() { $rootScope.showToast("Access Denied", "error"); });
    };

    $scope.register = function () {
        // Trim spaces to avoid "not matching" errors due to whitespace
        var p1 = ($scope.regData.password || "").trim();
        var p2 = ($scope.regData.confirm_password || "").trim();

        if (p1 !== p2) {
            $rootScope.showToast("Passwords do not match!", "error");
            return;
        }

        // --- UPDATED REGEX: Special Chars are now OPTIONAL ---
        // Allows: Uppercase, Lowercase, Number.
        // This will allow "Bharath8this" to pass.
        // Pattern: At least 1 lower, 1 upper, 1 digit. Special chars allowed but not required. Length 8+.
        var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
        
        if(!passwordRegex.test(p1)) {
            $rootScope.showToast("Password must contain 8+ chars, uppercase, lowercase, and a number.", "error");
            return;
        }

        var payload = angular.copy($scope.regData);
        payload.password = p1; // Send trimmed password
        delete payload.confirm_password;

        $http.post(API_CONFIG.url + "customer/", payload).then(function () {
            alert("Registration Successful! Please Login.");
            $window.location.href = 'login.html';
        }, function(err) { 
            var msg = err.data.error || (err.data.email ? "Email already exists." : "Registration Failed.");
            $rootScope.showToast(msg, "error"); 
        });
    };
});

// --- 7. PLAN CONTROLLER ---
app.controller('PlanCtrl', function ($scope, $http, API_CONFIG) {
    $http.get(API_CONFIG.url + "plan/").then(function(res){ $scope.plans = res.data; });
});

// --- 8. ADMIN DASHBOARD CONTROLLER ---
app.controller('AdminDashCtrl', function ($scope, $http, $window, API_CONFIG) {
    $scope.activeTab = 'products'; 
    $scope.tableData = [];
    $scope.currentItem = {};
    $scope.currentSchema = [];
    $scope.categories = []; 

    $http.get(API_CONFIG.url + "category/").then(function(res){
        $scope.categories = res.data;
    });

    var schemas = {
        'products': [
            { key: 'productName', label: 'Product Name', type: 'text' },
            { key: 'category', label: 'Category', type: 'select', options: 'categories' },
            { key: 'productImage', label: 'Image URL', type: 'text' },
            { key: 'productDescription', label: 'Description', type: 'textarea' }
        ],
        'categories': [
            { key: 'name', label: 'Category Name', type: 'text' },
            { key: 'description', label: 'Description', type: 'text' },
            { key: 'image_url', label: 'Image URL', type: 'text' }
        ],
        'products_sell': [
            { key: 'product', label: 'Product ID', type: 'number' },
            { key: 'customer', label: 'Seller ID', type: 'number' },
            { key: 'price', label: 'Price', type: 'number' },
            { key: 'quantity', label: 'Quantity', type: 'number' },
            { key: 'location', label: 'Location', type: 'text' }
        ],
        'products_buy': [
            { key: 'product', label: 'Product ID', type: 'number' },
            { key: 'customer', label: 'Buyer ID', type: 'number' },
            { key: 'price', label: 'Target Price', type: 'number' },
            { key: 'quantity', label: 'Quantity', type: 'number' },
            { key: 'buyerName', label: 'Buyer Name', type: 'text' }
        ],
        'customers': [
            { key: 'name', label: 'Full Name', type: 'text' },
            { key: 'email', label: 'Email', type: 'email' },
            { key: 'phone', label: 'Phone', type: 'text' },
            { key: 'address', label: 'Address', type: 'text' }
        ],
        'plans': [
            { key: 'name', label: 'Plan Name', type: 'text' },
            { key: 'price', label: 'Price', type: 'text' }
        ]
    };

    $scope.switchTab = function(tab) {
        $scope.activeTab = tab;
        $scope.currentSchema = schemas[tab];
        
        var endpoint = "";
        if(tab === 'products') endpoint = "product/";
        else if(tab === 'products_sell') endpoint = "product_sell/";
        else if(tab === 'products_buy') endpoint = "product_buy/";
        else if(tab === 'categories') endpoint = "category/";
        else if(tab === 'customers') endpoint = "customer/";
        else if(tab === 'plans') endpoint = "plan/";

        $http.get(API_CONFIG.url + endpoint).then(function(res) {
            $scope.tableData = res.data;
        });
    };
    
    $scope.switchTab('products');

    $scope.uploadCSV = function() {
        var fileInput = document.getElementById('csvFile');
        if(fileInput.files.length === 0) { alert("Select file"); return; }
        
        var formData = new FormData();
        formData.append('file', fileInput.files[0]);

        var modelSlug = "";
        if($scope.activeTab === 'products') modelSlug = 'product';
        else if($scope.activeTab === 'products_sell') modelSlug = 'product_sell';
        else if($scope.activeTab === 'products_buy') modelSlug = 'product_buy';
        else if($scope.activeTab === 'categories') modelSlug = 'category';
        else if($scope.activeTab === 'customers') modelSlug = 'customer';
        else modelSlug = 'plan';

        $http.post(API_CONFIG.url + "user/bulk-upload/" + modelSlug + "/", formData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).then(function(res) {
            alert(res.data.message);
            if(res.data.errors.length) alert("Errors:\n" + res.data.errors.join("\n"));
            $scope.switchTab($scope.activeTab); 
        }, function(err) { alert("Upload Failed: " + err.data.error); });
    };

    $scope.openAdd = function() {
        $scope.editMode = false;
        $scope.currentItem = {};
        $scope.currentSchema = schemas[$scope.activeTab];
    };
    
    $scope.editRow = function(row) {
        $scope.editMode = true;
        $scope.currentItem = angular.copy(row);
        $scope.currentSchema = schemas[$scope.activeTab];
    };
    
    $scope.saveRow = function() {
        var endpoint = "";
        if($scope.activeTab === 'products') endpoint = "product/";
        else if($scope.activeTab === 'products_sell') endpoint = "product_sell/";
        else if($scope.activeTab === 'products_buy') endpoint = "product_buy/";
        else if($scope.activeTab === 'categories') endpoint = "category/";
        else if($scope.activeTab === 'customers') endpoint = "customer/";
        else if($scope.activeTab === 'plans') endpoint = "plan/";

        var payload = angular.copy($scope.currentItem);
        delete payload.created_at; 
        
        if($scope.editMode) {
            $http.put(API_CONFIG.url + endpoint + $scope.currentItem.id + "/", payload).then(function() {
                alert("Updated!");
                $scope.switchTab($scope.activeTab);
                bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
            }, function(err) { alert("Error: " + JSON.stringify(err.data)); });
        } else {
            $http.post(API_CONFIG.url + endpoint, payload).then(function() {
                alert("Created!");
                $scope.switchTab($scope.activeTab);
                bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
            }, function(err) { alert("Error: " + JSON.stringify(err.data)); });
        }
    };
    
    $scope.deleteRow = function(id) {
        if(!confirm("Are you sure?")) return;
        var endpoint = "";
        if($scope.activeTab === 'products') endpoint = "product/";
        else if($scope.activeTab === 'products_sell') endpoint = "product_sell/";
        else if($scope.activeTab === 'products_buy') endpoint = "product_buy/";
        else if($scope.activeTab === 'categories') endpoint = "category/";
        else if($scope.activeTab === 'customers') endpoint = "customer/";
        else if($scope.activeTab === 'plans') endpoint = "plan/";

        $http.delete(API_CONFIG.url + endpoint + id + "/").then(function() {
            $scope.switchTab($scope.activeTab);
        });
    };

    $scope.getOptions = function(optionName) {
        return $scope[optionName] || [];
    };
});

// --- 9. POST SELL LISTING ---
app.controller('ProductSellCtrl', function ($scope, $http, $rootScope, $window, API_CONFIG) { 
    $scope.product_sell = {};
    $scope.categories = []; 
    $scope.productsList = []; 
    $scope.isSubmitting = false;

    $http.get(API_CONFIG.url + "category/").then(function(res){ $scope.categories = res.data; });

    $scope.loadProducts = function() {
        if(!$scope.product_sell.category) return;
        $http.get(API_CONFIG.url + "product/?category_id=" + $scope.product_sell.category)
             .then(function(res) { $scope.productsList = res.data; });
    };

    $scope.saveProductSell = function() {
        if(!$rootScope.currentUser) {
            $rootScope.showToast("Please login.", "error");
            $window.location.href = "login.html";
            return;
        }
        $scope.isSubmitting = true;
        $scope.product_sell.customer = $rootScope.currentUser.id;
        $scope.product_sell.sellerName = $rootScope.currentUser.name;
        $scope.product_sell.phoneNo = $rootScope.currentUser.phone;

        $http.post(API_CONFIG.url + "product_sell/", $scope.product_sell).then(function(){ 
            $rootScope.showToast("Success! Your produce is listed.", "success");
            $window.location.href = "customer_dashboard.html"; 
        }, function(err){ 
            $rootScope.showToast("Error posting product. Check your connection or image size.", "error"); 
            $scope.isSubmitting = false;
        });
    };
});

// --- 10. POST BUY REQUEST ---
app.controller('ProductBuyCtrl', function ($scope, $http, $rootScope, $window, API_CONFIG) { 
    $scope.product_buy = {};
    $scope.categories = []; 
    $scope.productsList = []; 
    $scope.isSubmitting = false;

    $http.get(API_CONFIG.url + "category/").then(function(res){ $scope.categories = res.data; });

    $scope.loadProducts = function() {
        if(!$scope.product_buy.category) return;
        $http.get(API_CONFIG.url + "product/?category_id=" + $scope.product_buy.category)
             .then(function(res) { $scope.productsList = res.data; });
    };

    $scope.saveProductBuy = function() {
        if(!$rootScope.currentUser) {
            $rootScope.showToast("Please login.", "error");
            $window.location.href = "login.html";
            return;
        }
        $scope.isSubmitting = true;
        $scope.product_buy.customer = $rootScope.currentUser.id;
        
        $http.post(API_CONFIG.url + "product_buy/", $scope.product_buy).then(function(){ 
            $rootScope.showToast("Request Posted!", "success");
            $window.location.href = "customer_dashboard.html";
        }, function(err){ 
            $rootScope.showToast("Error posting request.", "error"); 
            $scope.isSubmitting = false;
        });
    };
});

// --- 11. USER CONTROLLER (SYSTEM ADMINS) ---
app.controller('UserCtrl', function ($scope, $http, $window, API_CONFIG) {
    $scope.user = {};
    $scope.users = [];

    function loadUsers() {
        $http.get(API_CONFIG.url + "user/").then(function(res) {
            $scope.users = res.data;
        });
    }
    loadUsers();

    $scope.saveUser = function() {
        if ($scope.user.id) {
            // Edit Mode
            $http.put(API_CONFIG.url + "user/" + $scope.user.id + "/", $scope.user).then(function() {
                alert("Admin updated!");
                $scope.user = {};
                loadUsers();
            }, function(err) { alert("Error updating admin."); });
        } else {
            // Create Mode
            if(!$scope.user.password) {
                alert("Password is required for new admins.");
                return;
            }
            $http.post(API_CONFIG.url + "user/", $scope.user).then(function() {
                alert("New Admin created!");
                $scope.user = {};
                loadUsers();
            }, function(err) { alert("Error creating admin."); });
        }
    };

    $scope.editUser = function(u) {
        $scope.user = angular.copy(u);
        $scope.user.password = ""; 
    };

    $scope.deleteUser = function(id) {
        if(confirm("Delete this admin?")) {
            $http.delete(API_CONFIG.url + "user/" + id + "/").then(function() {
                loadUsers();
            });
        }
    };
});

// --- 12. CUSTOMER DASHBOARD CONTROLLER ---
app.controller('CustomerDashCtrl', function ($scope, $http, $rootScope, $window, API_CONFIG) {
    $scope.activeTab = 'sell';
    
    if(!$rootScope.currentUser) { window.location.href = 'login.html'; return; }

    $scope.myListings = [];
    $scope.myBuyRequests = [];
    $scope.incomingBids = [];
    $scope.myBids = [];
    $scope.incomingBidsCount = 0;

    function loadData() {
        $http.get(API_CONFIG.url + "product_sell/?customer_id=" + $rootScope.currentUser.id).then(function(res) {
            $scope.myListings = res.data;
            fetchAllBids();
        });
        $http.get(API_CONFIG.url + "product_buy/?customer_id=" + $rootScope.currentUser.id).then(function(res) {
            $scope.myBuyRequests = res.data;
        });
    }
    loadData();

    function fetchAllBids() {
        $http.get(API_CONFIG.url + "product_bid/").then(function(bidRes) {
            var allBids = bidRes.data;
            var mySellIds = $scope.myListings.map(p => p.id);
            var myBuyIds = $scope.myBuyRequests.map(p => p.id);
            
            var bidsOnMySells = allBids.filter(b => mySellIds.includes(b.sell_post));
            var bidsOnMyBuys = allBids.filter(b => myBuyIds.includes(b.buy_post));

            $scope.incomingBids = bidsOnMySells.concat(bidsOnMyBuys);
            $scope.incomingBidsCount = $scope.incomingBids.filter(b => b.status === 'PENDING').length;

            $scope.myBids = allBids.filter(b => b.bidder == $rootScope.currentUser.id);
        });
    }

    $scope.getBidsForProduct = function(productId, type) {
        return $scope.incomingBids.filter(function(b) { 
            if(type === 'sell') return b.sell_post == productId;
            if(type === 'buy') return b.buy_post == productId;
            return false;
        });
    };

    $scope.getPendingBidCount = function(productId, type) {
        return $scope.getBidsForProduct(productId, type).filter(b => b.status === 'PENDING').length;
    };

    $scope.updateBid = function(bid, status) {
        $http.put(API_CONFIG.url + "product_bid/" + bid.id + "/", { status: status }).then(function() {
            bid.status = status;
        });
    };

    $scope.deletePost = function(id, type) {
        if(!confirm("Are you sure you want to delete this listing? This action cannot be undone.")) return;
        
        var endpoint = (type === 'sell') ? "product_sell/" : "product_buy/";
        
        $http.delete(API_CONFIG.url + endpoint + id + "/?customer=" + $rootScope.currentUser.id)
            .then(function() {
                $rootScope.showToast("Listing deleted.", "info");
                loadData(); 
            }, function(err) {
                $rootScope.showToast("Error deleting: " + (err.data.error || "Server Error"), "error");
            });
    };

    // --- PROFILE IMAGE UPLOAD ---
    $scope.profileUpdate = {};
    
    $scope.updateProfileImage = function() {
        if(!$scope.profileUpdate.image) {
            $rootScope.showToast("Please select an image first", "error");
            return;
        }
        
        var payload = { profile_image: $scope.profileUpdate.image };
        
        $http.put(API_CONFIG.url + "customer/" + $rootScope.currentUser.id + "/", payload).then(function(res) {
            $rootScope.showToast("Profile Picture Updated!", "success");
            // Update Session Storage
            var updatedUser = res.data;
            $window.sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
            $rootScope.currentUser = updatedUser;
            $scope.profileUpdate = {}; // Reset
        }, function(err) {
            $rootScope.showToast("Update Failed", "error");
        });
    };
    
    $scope.logout = function() {
        $window.sessionStorage.clear();
        $window.location.href = 'index.html';
    };
});