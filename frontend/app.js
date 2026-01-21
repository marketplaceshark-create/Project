var app = angular.module('userApp', []);

// ==========================================
// ⚙️ CONFIGURATION: CHANGE BACKEND URL HERE
// ==========================================
app.constant('API_CONFIG', {
    // Keep the trailing slash!
    url: "https://fresh-clouds-call.loca.lt/" 
    // url: "http://127.0.0.1:8000/" // Uncomment for local dev
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
app.run(function($window, $rootScope, API_CONFIG) {
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
        
        // 1. Check if user uploaded a specific image or master image exists
        var img = item.image || item.productImage;
        if (!img) return null;
        
        // 2. If it's already a full URL (http/https), return as is
        if (img.startsWith('http')) return img;
        
        // 3. Otherwise, prepend backend URL from Config
        // Remove trailing slash from config if image has leading slash to avoid double //
        var baseUrl = API_CONFIG.url.endsWith('/') ? API_CONFIG.url.slice(0, -1) : API_CONFIG.url;
        var imgPath = img.startsWith('/') ? img : '/' + img;
        
        return baseUrl + imgPath;
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

    var sellRequest = $http.get(API_CONFIG.url + "product_sell/");
    var buyRequest = $http.get(API_CONFIG.url + "product_buy/");

    $q.all([sellRequest, buyRequest]).then(function (results) {
        var sales = results[0].data.map(function(item) { item.type = 'sell'; return item; });
        var buys = results[1].data.map(function(item) { 
            item.type = 'buy';
            item.displayName = "Wanted: " + (item.productName || item.name || "General Item"); 
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
            i.productName = "Wanted: " + (i.productName || i.name || "General"); 
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
            alert("Please login to place a bid.");
            window.location.href = "login.html";
            return;
        }
        if ($scope.isOwner) {
            alert("You cannot bid on your own post.");
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
            alert("Bid Placed Successfully!");
            $scope.bid = { quantity: 1, amount: "", message: "" }; // Reset form
            loadBids();
        }, function() { alert("Error placing bid. Please try again."); });
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

// --- 6. AUTH CONTROLLER ---
app.controller('AuthCtrl', function ($scope, $http, $window, API_CONFIG) {
    $scope.loginData = {};
    $scope.regData = {};

    $scope.loginCustomer = function () {
        $http.post(API_CONFIG.url + "customer/login/", $scope.loginData).then(function (res) {
            $window.sessionStorage.setItem('currentUser', JSON.stringify(res.data));
            $window.location.href = 'customer_dashboard.html';
        }, function() { alert("Invalid Credentials"); });
    };

    $scope.loginAdmin = function () {
        $http.post(API_CONFIG.url + "user/login/", $scope.loginData).then(function (res) {
            var admin = res.data; 
            admin.role = 'admin';
            $window.sessionStorage.setItem('currentUser', JSON.stringify(admin));
            $window.location.href = 'admin_dashboard.html';
        }, function() { alert("Access Denied"); });
    };

    $scope.register = function () {
        if ($scope.regData.password !== $scope.regData.confirm_password) {
            alert("Passwords do not match!");
            return;
        }
        var payload = angular.copy($scope.regData);
        delete payload.confirm_password;

        $http.post(API_CONFIG.url + "customer/", payload).then(function () {
            alert("Registration Successful! Please Login.");
            $window.location.href = 'login.html';
        }, function(err) { 
            var msg = err.data.email ? "Email already exists." : "Registration Failed.";
            alert(msg); 
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
            alert("Please login.");
            $window.location.href = "login.html";
            return;
        }
        $scope.isSubmitting = true;
        $scope.product_sell.customer = $rootScope.currentUser.id;
        $scope.product_sell.sellerName = $rootScope.currentUser.name;
        $scope.product_sell.phoneNo = $rootScope.currentUser.phone;

        $http.post(API_CONFIG.url + "product_sell/", $scope.product_sell).then(function(){ 
            alert("Success! Your produce is listed.");
            $window.location.href = "customer_dashboard.html"; 
        }, function(err){ 
            alert("Error posting product. Check your connection or image size."); 
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
            alert("Please login.");
            $window.location.href = "login.html";
            return;
        }
        $scope.isSubmitting = true;
        $scope.product_buy.customer = $rootScope.currentUser.id;
        
        $http.post(API_CONFIG.url + "product_buy/", $scope.product_buy).then(function(){ 
            alert("Request Posted!");
            $window.location.href = "customer_dashboard.html";
        }, function(err){ 
            alert("Error posting request."); 
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
                alert("Listing deleted.");
                loadData(); 
            }, function(err) {
                alert("Error deleting: " + (err.data.error || "Server Error"));
            });
    };
    
    $scope.logout = function() {
        $window.sessionStorage.clear();
        $window.location.href = 'index.html';
    };
});