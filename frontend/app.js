
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

// --- 2. MARKETPLACE CONTROLLER (HOME PAGE) ---
app.controller('MarketplaceCtrl', function ($scope, $http, $window, $q, API_CONFIG) {
    $scope.searchText = ""; 
    $scope.homeSections = []; // Dynamic Sections

    $scope.goToMarket = function() {
        $window.location.href = 'market.html?q=' + encodeURIComponent($scope.searchText);
    };

    $scope.openProduct = function(p) {
        $window.location.href = 'product_detail.html?id=' + p.id + '&type=' + p.type;
    };

    // ... (Keep loadWeather and initChart functions as they are) ...

    // FETCH DATA DYNAMICALLY
    var catRequest = $http.get(API_CONFIG.url + "category/");
    var sellRequest = $http.get(API_CONFIG.url + "product_sell/");
    var buyRequest = $http.get(API_CONFIG.url + "product_buy/");

    $q.all([catRequest, sellRequest, buyRequest]).then(function (results) {
        var categories = results[0].data;
        var sales = results[1].data.map(function(item) { item.type = 'sell'; return item; });
        var buys = results[2].data.map(function(item) { 
            item.type = 'buy';
            var label = (item.name === 'General' && item.productName) ? item.productName : (item.name || item.productName || "General Item");
            item.productName = "Wanted: " + label;
            return item;
        });

        var allItems = sales.concat(buys);
        organizeProductsForHome(categories, allItems);
    });

    function organizeProductsForHome(categories, products) {
        // Create a section for EVERY category from the database
        $scope.homeSections = categories.map(function(cat) {
            return {
                id: cat.id,
                title: cat.name,
                items: products.filter(function(p) {
                    // Match Product Category ID to Current Category ID
                    return p.category == cat.id; 
                })
            };
        });

        // Filter out empty sections so the homepage looks clean
        $scope.homeSections = $scope.homeSections.filter(function(sec) {
            return sec.items.length > 0;
        });
    }
});

// --- 3. MARKET CONTROLLER (SEARCH & FILTERS) ---
app.controller('MarketCtrl', function ($scope, $http, $q, $window, API_CONFIG) {
    // Filters with Min/Max Price, Category, Product
    $scope.filters = { 
        type: 'sell', 
        search: '', 
        location: '', 
        minPrice: null, 
        maxPrice: null,
        categoryId: null,
        productId: null
    };

    $scope.locations = []; 
    $scope.allItems = [];
    $scope.filteredItems = [];
    $scope.categories = [];
    $scope.masterProducts = [];

    // 1. Fetch Categories
    $http.get(API_CONFIG.url + "category/").then(function(res){ 
        $scope.categories = res.data; 
    });

    // 2. Fetch Master Products (For Product Filter)
    $http.get(API_CONFIG.url + "product/").then(function(res){ 
        $scope.masterProducts = res.data; 
    });

    // 3. Handle URL Params
    var urlParams = new URLSearchParams(window.location.search);
    var categoryId = urlParams.get('category_id'); 
    var searchQuery = urlParams.get('q'); 
    var categoryName = urlParams.get('cat');

    if(searchQuery) $scope.filters.search = searchQuery;
    // Map Category Name to ID if passed via URL
    if(categoryName) {
        $scope.filters.search = categoryName; 
        // Note: Ideally we map name->id here if we want strict category filtering
    }
    if(categoryId) $scope.filters.categoryId = parseInt(categoryId);

    var config = {};
    if (categoryId) config.params = { category_id: categoryId };

    // 4. Fetch All Items
    var sellReq = $http.get(API_CONFIG.url + "product_sell/", config);
    var buyReq = $http.get(API_CONFIG.url + "product_buy/", config);

    $q.all([sellReq, buyReq]).then(function(results) {
        var sales = results[0].data.map(function(i) { i.type = 'sell'; i.trusted = true; return i; });
        var buys = results[1].data.map(function(i) { 
            i.type = 'buy'; 
            var displayLabel = (i.name === 'General' && i.productName) ? i.productName : (i.name || i.productName || "General");
            i.productName = "Wanted: " + displayLabel;
            if(i.name === 'General') i.name = null;
            return i; 
        });

        $scope.allItems = sales.concat(buys);
        
        // Populate Location Datalist
        var lSet = new Set();
        $scope.allItems.forEach(function(item) {
            if(item.location) lSet.add(item.location.trim());
        });
        $scope.locations = Array.from(lSet).sort();

        $scope.applyFilters();
    });

    $scope.resetFilters = function() {
        $scope.filters = { 
            type: 'sell', 
            search: '', 
            location: '', 
            minPrice: null, 
            maxPrice: null,
            categoryId: null,
            productId: null
        };
        $scope.applyFilters();
    };

    $scope.applyFilters = function() {
        var f = $scope.filters;
        var term = (f.search || "").toLowerCase();

        $scope.filteredItems = $scope.allItems.filter(function(item) {
            // 1. Listing Type
            if (f.type !== 'all' && f.type && item.type !== f.type) return false;
            
            // 2. Category Filter
            if (f.categoryId && item.category != f.categoryId) return false;

            // 3. Product Filter
            // Note: Buy requests might check against 'product' ID if linked, 
            // otherwise text search handles general requests.
            if (f.productId && item.product != f.productId) return false;

            // 4. Text Search (Name or Location)
            var nameStr = (item.productName || "") + " " + (item.name || "");
            var textMatch = (nameStr.toLowerCase().includes(term)) || 
                            (item.location && item.location.toLowerCase().includes(term));
            if (!textMatch) return false;
            
            // 5. Location Filter (Exact or Partial)
            if (f.location && !item.location.toLowerCase().includes(f.location.toLowerCase())) return false;

            // 6. Price Range
            if (f.minPrice !== null && f.minPrice !== "" && item.price < f.minPrice) return false;
            if (f.maxPrice !== null && f.maxPrice !== "" && item.price > f.maxPrice) return false;

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
            // Default unit
            if(!$scope.product.unit) $scope.product.unit = 'kg';

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
            return;
        }
        if ($scope.isOwner) {
            $rootScope.showToast("You cannot bid on your own post.", "error");
            return;
        }
        
        // Frontend Check for Quantity
        if($scope.bid.quantity > $scope.product.quantity) {
             $rootScope.showToast("Bid quantity cannot exceed available stock (" + $scope.product.quantity + ")", "error");
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
            $scope.bid = { quantity: 1, amount: "", message: "" };
            loadBids();
        }, function(err) { 
            var msg = err.data.error || "Error placing bid.";
            $rootScope.showToast(msg, "error"); 
        });
    };

    $scope.updateBidStatus = function(bid, status) {
        $http.put(API_CONFIG.url + "product_bid/" + bid.id + "/", { status: status }).then(function() {
            bid.status = status;
        });
    };
});

// Path: frontend/app.js (inside your main app.js file)

// ... (Keep the code before this as is)

// --- 5. CATEGORY PAGE CONTROLLER (UPDATED) ---
app.controller('CategoryPageCtrl', function($scope, $http, $window, $q, API_CONFIG) {
    $scope.categories = [];
    $scope.searchQuery = "";

    // 1. Fetch Categories AND Master Products from Backend
    // This fetches the full list: Vegetables, Fruits, Grains, Spices, Commercial, Others, etc.
    var catReq = $http.get(API_CONFIG.url + "category/");
    var prodReq = $http.get(API_CONFIG.url + "product/"); // To populate search tags

    $q.all([catReq, prodReq]).then(function(results) {
        $scope.categories = results[0].data;
        var masterProducts = results[1].data;

        // Map sample products to categories for the search feature
        $scope.categories.forEach(function(cat) {
            cat.productList = masterProducts
                .filter(function(p) { return p.category == cat.id; })
                .map(function(p) { return p.productName; });
        });
    });

    // 2. Dynamic Filter Function
    $scope.categoryFilter = function(cat) {
        if (!$scope.searchQuery) return true;
        var query = $scope.searchQuery.toLowerCase();
        
        var nameMatch = cat.name.toLowerCase().indexOf(query) !== -1;
        var productMatch = false;
        
        if (cat.productList && cat.productList.length > 0) {
            productMatch = cat.productList.some(function(product) {
                return product.toLowerCase().indexOf(query) !== -1;
            });
        }
        return nameMatch || productMatch;
    };

    // 3. Updated Icons to include New Categories
    $scope.getCategoryIcon = function(name) {
        var n = (name || "").toLowerCase();
        if(n.includes('veg')) return 'bi-carrot';
        if(n.includes('fruit')) return 'bi-apple';
        if(n.includes('grain')) return 'bi-flower1';
        if(n.includes('dairy')) return 'bi-droplet';
        if(n.includes('spice')) return 'bi-stars';       // Spices
        if(n.includes('commercial')) return 'bi-briefcase'; // Commercial
        if(n.includes('other')) return 'bi-grid';        // Others
        return 'bi-box-seam'; // Default
    };

    $scope.goToMarket = function(cat) {
        // Pass Category ID for better filtering
        $window.location.href = 'market.html?category_id=' + cat.id + '&cat=' + cat.name;
    };
});
// ... (Keep the rest of app.js)
// --- 6. AUTH CONTROLLER ---
app.controller('AuthCtrl', function ($scope, $http, $window, $rootScope, API_CONFIG) {
    $scope.loginData = {};
    $scope.regData = {};
    $scope.showPassword = false; 

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
        var p1 = ($scope.regData.password || "").trim();
        var p2 = ($scope.regData.confirm_password || "").trim();

        if (p1 !== p2) {
            $rootScope.showToast("Passwords do not match!", "error");
            return;
        }

        var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
        if(!passwordRegex.test(p1)) {
            $rootScope.showToast("Password must contain 8+ chars, uppercase, lowercase, and a number.", "error");
            return;
        }

        var payload = angular.copy($scope.regData);
        payload.password = p1; 
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

// ... existing code ...

// --- 7. PLAN CONTROLLER ---
app.controller('PlanCtrl', function ($scope, $http, $rootScope, $window, API_CONFIG) {
    // $http.get(API_CONFIG.url + "plan/").then(function(res){ $scope.plans = res.data; });

    $scope.buyPlan = function(tier, planName) {
        if(!$rootScope.currentUser) {
            $rootScope.showToast("Please login to purchase a plan.", "error");
            $window.location.href = 'login.html';
            return;
        }

        // Simulating Payment Gateway interaction
        var confirmPurchase = confirm("Confirm purchase of " + planName + "?\n\n(This is a demo, no actual charge will occur)");
        
        if(confirmPurchase) {
            // Update User Tier in Backend
            var userId = $rootScope.currentUser.id;
            
            $http.put(API_CONFIG.url + "customer/" + userId + "/", { plan_tier: tier })
                .then(function(res) {
                    $rootScope.showToast("Plan Upgraded to " + planName + "!", "success");
                    
                    // Update Local Session
                    var updatedUser = res.data;
                    $window.sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
                    $rootScope.currentUser = updatedUser;
                    
                    // Redirect to Dashboard
                    setTimeout(function() {
                        $window.location.href = 'customer_dashboard.html';
                    }, 1000);

                }, function(err) {
                    $rootScope.showToast("Purchase Failed. Try again.", "error");
                });
        }
    };
});

// ... rest of existing code ...

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
    $scope.product_sell = { unit: 'kg' }; // Default to kg
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
            // Handle Plan Limit Error Specifically
            if (err.status === 402) {
                $rootScope.showToast(err.data.error, "error");
                setTimeout(function(){ $window.location.href = 'plan.html'; }, 3000);
            } else {
                $rootScope.showToast("Error posting product: " + (err.data.error || "Unknown"), "error"); 
            }
            $scope.isSubmitting = false;
        });
    };
});

// --- 10. POST BUY REQUEST ---
app.controller('ProductBuyCtrl', function ($scope, $http, $rootScope, $window, API_CONFIG) { 
    $scope.product_buy = { unit: 'kg' }; // Default
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
            $http.put(API_CONFIG.url + "user/" + $scope.user.id + "/", $scope.user).then(function() {
                alert("Admin updated!");
                $scope.user = {};
                loadUsers();
            }, function(err) { alert("Error updating admin."); });
        } else {
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
// =======================================================
// ✅ PROFILE CONTROLLER
// =======================================================
app.controller('ProfileCtrl', function ($scope, $http, $window, $rootScope, API_CONFIG) {
    // 1. Check if user is logged in
    if(!$rootScope.currentUser) {
        $window.location.href = 'login.html';
        return;
    }

    // 2. Load current data into the form (Copy prevents live editing of the navbar name)
    $scope.profile = angular.copy($rootScope.currentUser);
    
    // Remove password field for security
    delete $scope.profile.password; 

    // 3. Update Function
    $scope.updateProfile = function() {
        var userId = $rootScope.currentUser.id;
        
        // Prepare Payload
        var payload = {
            name: $scope.profile.name,
            phone: $scope.profile.phone,
            address: $scope.profile.address,
            email: $scope.profile.email 
        };

        // If a new image was selected (base64 string), add it
        if ($scope.profile.newImage) {
            payload.profile_image = $scope.profile.newImage; 
        }

        // Send PUT Request
        $http.put(API_CONFIG.url + "customer/" + userId + "/", payload).then(function(res) {
            $rootScope.showToast("Profile Updated Successfully!", "success");
            
            // Update Session Storage with new data (so navbar updates on refresh)
            var updatedUser = res.data;
            $window.sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
            $rootScope.currentUser = updatedUser;
            
        }, function(err) {
            $rootScope.showToast("Update Failed: " + (err.data.error || "Server Error"), "error");
        });
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
        // Optimistic UI update not safe here due to Race Conditions checks on backend
        // We wait for response
        $http.put(API_CONFIG.url + "product_bid/" + bid.id + "/", { status: status }).then(function(res) {
            bid.status = status;
            $rootScope.showToast("Bid Updated Successfully!", "success");
            
            // Reload data to reflect new inventory counts if Accepted
            if(status === 'ACCEPTED') loadData();
            
        }, function(err) {
            if(err.status === 409) {
                // Conflict: Race Condition / Insufficient Stock
                $rootScope.showToast("Stock Insufficient! " + err.data.error, "error");
                bid.status = 'INVALID'; // Update local state to reflect backend reality
            } else {
                $rootScope.showToast("Error updating bid.", "error");
            }
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