## File: frontend/about.html
```html
# Path: frontend/about.html
<!DOCTYPE html>
<html lang="en" ng-app="userApp">
<head>
    <meta charset="UTF-8">
    <title>About Us - Agrivendia</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="css/styles.css" rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
    <script src="app.js"></script>
    <style>
        .about-hero { background: #2E7D32; color: white; padding: 80px 0; text-align: center; }
        .icon-circle { width: 70px; height: 70px; background: #e8f5e9; color: #2E7D32; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; margin-bottom: 20px; }
    </style>
</head>
<body ng-controller="MarketplaceCtrl">

    <div ng-include="'components/navbar.html'" ng-init="activePage='about'"></div>

    <div class="about-hero">
        <div class="container">
            <h1 class="fw-bold display-4">Cultivating Connections</h1>
            <p class="lead opacity-75">Bridging the gap between hardworking farmers and smart buyers.</p>
        </div>
    </div>

    <div class="container py-5">
        <div class="row align-items-center mb-5">
            <div class="col-lg-6">
                <h6 class="text-success fw-bold text-uppercase ls-1">Our Mission</h6>
                <h2 class="fw-bold mb-4">Empowering the Agricultural Community</h2>
                <p class="text-muted">Agrivendia creates a transparent digital marketplace where trade happens freely and fairly.</p>
                <p class="text-muted">Whether you are a farmer looking to sell your harvest or a business looking for bulk supplies, Agrivendia provides the tools you need.</p>
            </div>
            <div class="col-lg-6 text-center">
                <i class="bi bi-globe-central-south-asia text-success opacity-25" style="font-size: 15rem;"></i>
            </div>
        </div>

        <div class="row g-4 mt-4">
            <div class="col-md-4">
                <div class="feature-box p-4 h-100">
                    <div class="icon-circle"><i class="bi bi-shop"></i></div>
                    <h5 class="fw-bold">Direct from Farm</h5>
                    <p class="text-muted small">Products listed directly by growers.</p>
                </div>
            </div>
            <div class="col-md-4">
                <div class="feature-box p-4 h-100">
                    <div class="icon-circle"><i class="bi bi-shield-check"></i></div>
                    <h5 class="fw-bold">Fair Pricing</h5>
                    <p class="text-muted small">Transparent prices without inflated costs.</p>
                </div>
            </div>
            <div class="col-md-4">
                <div class="feature-box p-4 h-100">
                    <div class="icon-circle"><i class="bi bi-people"></i></div>
                    <h5 class="fw-bold">Trusted Network</h5>
                    <p class="text-muted small">Verified users for safe trading.</p>
                </div>
            </div>
        </div>
    </div>

    <div ng-include="'components/footer.html'"></div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
```

---

## File: frontend/admin_dashboard.html
```html
# Path: frontend/admin_dashboard.html
<!DOCTYPE html>
<html lang="en" ng-app="userApp">
<head>
    <meta charset="UTF-8">
    <title>Admin Dashboard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link href="css/styles.css" rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
    <script src="app.js"></script>
</head>
<body ng-controller="AdminDashCtrl" style="display: flex; overflow: hidden; background: #f4f6f8;">

    <!-- SIDEBAR -->
    <div class="sidebar">
        <div class="sidebar-header"><i class="bi bi-shield-lock-fill me-2"></i> Admin Portal</div>
        <nav class="mt-3">
            <div class="nav-link" ng-class="{'active': activeTab=='categories'}" ng-click="switchTab('categories')"><i class="bi bi-tags me-2"></i> Categories</div>
            <div class="nav-link" ng-class="{'active': activeTab=='products'}" ng-click="switchTab('products')"><i class="bi bi-box me-2"></i> Products</div>
            <div class="nav-link" ng-class="{'active': activeTab=='plans'}" ng-click="switchTab('plans')"><i class="bi bi-card-checklist me-2"></i> Plans</div>
            <div class="nav-link" ng-class="{'active': activeTab=='customers'}" ng-click="switchTab('customers')"><i class="bi bi-people me-2"></i> Customers</div>
        </nav>
        <div class="mt-auto p-3"><a href="index.html" class="btn btn-outline-secondary w-100 text-light border-secondary">Back to Site</a></div>
    </div>

    <!-- MAIN CONTENT -->
    <div style="flex: 1; padding: 30px; overflow-y: auto;">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="fw-bold text-dark text-capitalize">{{activeTab.replace('_', ' ')}}</h3>
            <div class="d-flex gap-2">
                <form class="d-flex bg-white p-1 rounded border shadow-sm">
                    <input type="file" id="csvFile" class="form-control form-control-sm border-0" accept=".csv">
                    <button type="button" class="btn btn-dark btn-sm rounded" ng-click="uploadCSV()"><i class="bi bi-upload"></i></button>
                </form>
                <button class="btn btn-success btn-sm px-3 fw-bold" data-bs-toggle="modal" data-bs-target="#editModal" ng-click="openAdd()"><i class="bi bi-plus-lg"></i> Add</button>
            </div>
        </div>

        <div class="admin-card">
            <table class="table table-hover mb-0 custom-table">
                <thead><tr><th ng-repeat="field in currentSchema">{{field.label}}</th><th class="text-end">Actions</th></tr></thead>
                <tbody>
                    <tr ng-repeat="row in tableData">
                        <td ng-repeat="field in currentSchema">
                            <span ng-if="!field.key.includes('Image')">{{row[field.key]}}</span>
                            <img ng-if="field.key.includes('Image')" ng-src="{{row[field.key]}}" style="height:30px;">
                        </td>
                        <td class="text-end">
                             <button class="action-btn btn-edit" ng-click="editRow(row)" data-bs-toggle="modal" data-bs-target="#editModal"><i class="bi bi-pencil-fill"></i></button>
                             <button class="action-btn btn-delete" ng-click="deleteRow(row.id)"><i class="bi bi-trash-fill"></i></button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- MODAL -->
    <div class="modal fade" id="editModal">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow">
                <div class="modal-header bg-success text-white">
                    <h5 class="modal-title">{{ editMode ? 'Edit' : 'Add' }} Record</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="adminForm">
                        <div class="mb-3" ng-repeat="field in currentSchema">
                            <label class="form-label small fw-bold text-muted">{{field.label}}</label>
                            
                            <!-- Standard Inputs -->
                            <input ng-if="field.type != 'textarea' && field.type != 'select'" type="{{field.type}}" class="form-control" ng-model="currentItem[field.key]">
                            
                            <!-- Textarea -->
                            <textarea ng-if="field.type == 'textarea'" class="form-control" rows="3" ng-model="currentItem[field.key]"></textarea>
                            
                            <!-- Dropdown (Specific logic for categories) -->
                            <select ng-if="field.type == 'select'" class="form-select" ng-model="currentItem[field.key]" ng-options="opt.id as opt.name for opt in getOptions(field.options)">
                                <option value="">Select {{field.label}}</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary rounded-pill" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-success rounded-pill" ng-click="saveRow()">Save</button>
                </div>
            </div>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
```

---

## File: frontend/category.html
```html
# Path: frontend/category.html
<!DOCTYPE html>
<html lang="en" ng-app="userApp">
<head>
    <meta charset="UTF-8">
    <title>Categories - Agrivendia</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="css/styles.css" rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
    <script src="app.js"></script>
    <style>
        .cat-icon { width: 80px; height: 80px; background: #f1f8e9; color: #2E7D32; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; margin: 0 auto 20px; transition: 0.3s; }
        .category-card:hover .cat-icon { background: #2E7D32; color: white; }
    </style>
</head>
<body ng-controller="CategoryPageCtrl">

    <div ng-include="'components/navbar.html'" ng-init="activePage='category'"></div>

    <div class="bg-light py-5 text-center border-bottom">
        <div class="container">
            <h1 class="fw-bold text-success">Browse Categories</h1>
            <p class="text-muted">Find exactly what you need</p>
            <div class="position-relative mx-auto" style="max-width: 500px;">
                <input type="text" class="form-control rounded-pill py-3 px-4" ng-model="searchQuery" placeholder="Search categories...">
            </div>
        </div>
    </div>

    <div class="container py-5">
        <div class="row g-4">
            <div class="col-lg-3 col-md-4 col-sm-6" ng-repeat="cat in categories | filter:searchQuery">
                <div class="category-card p-4 text-center h-100 cursor-pointer" ng-click="goToMarket(cat)" style="cursor:pointer">
                    <div class="cat-icon"><i class="bi" ng-class="getCategoryIcon(cat.name)"></i></div>
                    <h5 class="fw-bold text-dark">{{cat.name}}</h5>
                    <p class="text-muted small">{{cat.description | limitTo:60}}...</p>
                    <span class="text-success fw-bold small">View Products <i class="bi bi-arrow-right"></i></span>
                </div>
            </div>
        </div>
        <div class="text-center text-muted py-5" ng-if="categories.length === 0">
            <div class="spinner-border text-success"></div>
        </div>
    </div>
    
    <div ng-include="'components/footer.html'"></div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
```

---

## File: frontend/user.html
```html
# Path: frontend/user.html
<!DOCTYPE html>
<html lang="en" ng-app="userApp">
<head>
    <meta charset="UTF-8">
    <title>Users - Agrivendia</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
    <script src="app.js"></script>
    <style>
        body { font-family: 'Poppins', sans-serif; background-color: #F1F8E9; }
        .navbar { background: white; box-shadow: 0 4px 15px rgba(0,0,0,0.05); padding: 15px 0; }
        .navbar-brand { font-weight: 700; color: #2E7D32 !important; }
        .btn-back { background: #e8f5e9; color: #2E7D32; border: none; border-radius: 50px; padding: 5px 15px; font-weight: 500; transition: 0.3s; }
        .btn-back:hover { background: #2E7D32; color: white; }
        .admin-card { background: white; border: none; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); overflow: hidden; height: 100%; }
        .card-header-custom { background: #2E7D32; color: white; padding: 20px; font-weight: 600; display: flex; align-items: center; }
        .form-control { background: #f9f9f9; border: 1px solid #eee; border-radius: 8px; padding: 12px; }
        .form-control:focus { border-color: #2E7D32; background: white; box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1); }
        .btn-submit { background: #2E7D32; color: white; border: none; padding: 12px; border-radius: 8px; font-weight: 600; width: 100%; transition: 0.3s; }
        .btn-submit:hover { background: #1B5E20; transform: translateY(-2px); }
        .custom-table thead th { background: #f1f8e9; color: #2E7D32; border: none; padding: 15px; font-weight: 600; }
        .custom-table tbody td { padding: 15px; border-bottom: 1px solid #eee; vertical-align: middle; }
        .action-btn { width: 35px; height: 35px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; border: none; transition: 0.2s; margin-left: 5px; }
        .btn-edit { background: #e3f2fd; color: #1976d2; }
        .btn-delete { background: #ffebee; color: #d32f2f; }
    </style>
</head>
<body ng-controller="UserCtrl">
    <nav class="navbar sticky-top mb-5">
        <div class="container">
            <a class="navbar-brand" href="index.html">Agrivendia <span class="badge bg-success rounded-pill small ms-2">Admin</span></a>
            <a href="admin_dashboard.html" class="btn-back"><i class="bi bi-arrow-left"></i> Dashboard</a>
        </div>
    </nav>
    <div class="container">
        <div class="row g-4">
            <div class="col-lg-4">
                <div class="admin-card">
                    <div class="card-header-custom"><i class="bi bi-shield-lock me-2"></i> {{ user.id ? 'Edit' : 'Add' }} User</div>
                    <div class="p-4">
                        <form ng-submit="saveUser()">
                            <div class="mb-3">
                                <label class="small fw-bold text-muted">NAME</label>
                                <input type="text" class="form-control" ng-model="user.name" required>
                            </div>
                            <div class="mb-3">
                                <label class="small fw-bold text-muted">EMAIL</label>
                                <input type="email" class="form-control" ng-model="user.email" required>
                            </div>
                            <div class="mb-3">
                                <label class="small fw-bold text-muted">PHONE</label>
                                <input type="text" class="form-control" ng-model="user.phone" required>
                            </div>
                            <div class="mb-4">
                                <label class="small fw-bold text-muted">PASSWORD</label>
                                <input type="password" class="form-control" ng-model="user.password" placeholder="{{ user.id ? 'Blank to keep current' : 'Required for new user' }}" ng-required="!user.id">
                            </div>
                            <button type="submit" class="btn-submit shadow-sm">{{ user.id ? 'Update User' : 'Create User' }}</button>
                        </form>
                    </div>
                </div>
            </div>
            <div class="col-lg-8">
                <div class="admin-card">
                    <div class="p-4 border-bottom"><h5 class="fw-bold m-0 text-success">System Administrators</h5></div>
                    <div class="table-responsive">
                        <table class="table custom-table mb-0">
                            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th class="text-end">Actions</th></tr></thead>
                            <tbody>
                                <tr ng-repeat="u in users">
                                    <td class="fw-bold text-dark">{{u.name}}</td>
                                    <td>{{u.email}}</td>
                                    <td>{{u.phone}}</td>
                                    <td class="text-end">
                                        <button class="action-btn btn-edit" ng-click="editUser(u)"><i class="bi bi-pencil-fill"></i></button>
                                        <button class="action-btn btn-delete" ng-click="deleteUser(u.id)"><i class="bi bi-trash-fill"></i></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
```

---

## File: frontend/customer_dashboard.html
```html
# Path: frontend/customer_dashboard.html
<!DOCTYPE html>
<html lang="en" ng-app="userApp">
<head>
    <meta charset="UTF-8">
    <title>My Dashboard - Agrivendia</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link href="css/styles.css" rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
    <script src="app.js"></script>
    <style>
        .nav-pills .nav-link.active { background-color: #2E7D32; }
        .nav-pills .nav-link { color: #555; font-weight: 600; border-radius: 50px; padding: 10px 25px; margin: 0 5px; }
        .listing-card { border-left: 5px solid transparent; margin-bottom: 20px; }
        .listing-card.sell { border-color: #2E7D32; }
        .listing-card.buy { border-color: #0d6efd; }
        .bid-item { background: #f8f9fa; border-radius: 8px; padding: 15px; margin-top: 10px; }
    </style>
</head>
<body ng-controller="CustomerDashCtrl">

    <!-- HEADER -->
    <div class="dash-header">
        <div class="container d-flex justify-content-between align-items-center">
            <div>
                <h2 class="fw-bold m-0"><i class="bi bi-grid-fill me-2"></i> Dashboard</h2>
                <p class="mb-0 opacity-75">Welcome back, {{currentUser.name}}</p>
            </div>
            <div class="d-flex gap-2">
                <a href="index.html" class="btn btn-outline-light rounded-pill btn-sm px-3">Home</a>
                <button ng-click="logout()" class="btn btn-warning rounded-pill btn-sm px-3 fw-bold">Logout</button>
            </div>
        </div>
    </div>

    <div class="container pb-5">
        <!-- STATS -->
        <div class="row mb-5">
            <div class="col-md-4"><div class="stats-box"><h2 class="fw-bold text-success">{{myListings.length}}</h2><small class="fw-bold text-muted">ACTIVE SALES</small></div></div>
            <div class="col-md-4"><div class="stats-box"><h2 class="fw-bold text-primary">{{myBuyRequests.length}}</h2><small class="fw-bold text-muted">BUY REQUESTS</small></div></div>
            <div class="col-md-4"><div class="stats-box"><h2 class="fw-bold text-warning">{{incomingBidsCount}}</h2><small class="fw-bold text-muted">PENDING BIDS</small></div></div>
        </div>

        <!-- TABS -->
        <ul class="nav nav-pills justify-content-center mb-4">
            <li class="nav-item"><a class="nav-link" ng-class="{'active': activeTab == 'sell'}" ng-click="activeTab = 'sell'">My Sales</a></li>
            <li class="nav-item"><a class="nav-link" ng-class="{'active': activeTab == 'requests'}" ng-click="activeTab = 'requests'">My Requests</a></li>
            <li class="nav-item"><a class="nav-link" ng-class="{'active': activeTab == 'bids'}" ng-click="activeTab = 'bids'">My Offers</a></li>
        </ul>

        <!-- TAB CONTENT: SALES -->
        <div ng-show="activeTab == 'sell'">
            <div class="d-flex justify-content-between mb-3">
                <h5 class="fw-bold text-success">Selling</h5>
                <a href="product_sell.html" class="btn btn-success rounded-pill btn-sm fw-bold"><i class="bi bi-plus-lg"></i> Post Sale</a>
            </div>
            <div class="listing-card feature-box p-4 sell" ng-repeat="item in myListings">
                <div class="d-flex justify-content-between">
                    <div>
                        <h5 class="fw-bold">{{item.productName}} <small class="text-muted">({{item.name}})</small></h5>
                        <div class="small text-muted">{{item.quantity}} Units | ₹{{item.price}} | {{item.location}}</div>
                    </div>
                    <button class="btn btn-sm btn-outline-secondary rounded-pill" ng-click="item.showBids = !item.showBids">
                        {{item.showBids ? 'Hide Offers' : 'View Offers'}}
                        <span class="badge bg-danger rounded-pill ms-1" ng-if="getPendingBidCount(item.id, 'sell') > 0">{{getPendingBidCount(item.id, 'sell')}}</span>
                    </button>
                </div>
                <div ng-if="item.showBids" class="mt-3 border-top pt-3">
                    <div ng-repeat="bid in getBidsForProduct(item.id, 'sell')" class="bid-item d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{{bid.bidder_details.name}}</strong> wants {{bid.quantity}} units at <strong class="text-success">₹{{bid.amount}}</strong>
                        </div>
                        <div ng-if="bid.status == 'PENDING'">
                            <button class="btn btn-sm btn-success rounded-pill" ng-click="updateBid(bid, 'ACCEPTED')">Accept</button>
                            <button class="btn btn-sm btn-outline-danger rounded-pill" ng-click="updateBid(bid, 'REJECTED')">Reject</button>
                        </div>
                        <div ng-if="bid.status != 'PENDING'" class="badge" ng-class="{'bg-success': bid.status=='ACCEPTED', 'bg-danger': bid.status=='REJECTED'}">{{bid.status}}</div>
                    </div>
                    <div ng-if="getBidsForProduct(item.id, 'sell').length == 0" class="text-muted small">No offers yet.</div>
                </div>
            </div>
        </div>

        <!-- TAB CONTENT: BUY REQUESTS (Reuse structure) -->
        <div ng-show="activeTab == 'requests'">
            <div class="d-flex justify-content-between mb-3">
                <h5 class="fw-bold text-primary">Buying</h5>
                <a href="product_buy.html" class="btn btn-primary rounded-pill btn-sm fw-bold"><i class="bi bi-plus-lg"></i> Post Request</a>
            </div>
            <div class="listing-card feature-box p-4 buy" ng-repeat="item in myBuyRequests">
                <div class="d-flex justify-content-between">
                    <div>
                        <h5 class="fw-bold">{{item.productName}}</h5>
                        <div class="small text-muted">Need {{item.quantity}} Units | Target: ₹{{item.price}} | {{item.location}}</div>
                    </div>
                    <button class="btn btn-sm btn-outline-secondary rounded-pill" ng-click="item.showBids = !item.showBids">
                        View Sellers
                    </button>
                </div>
                <div ng-if="item.showBids" class="mt-3 border-top pt-3">
                    <!-- Similar Bid Logic for Buy Requests -->
                    <div ng-repeat="bid in getBidsForProduct(item.id, 'buy')" class="bid-item d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{{bid.bidder_details.name}}</strong> offers {{bid.quantity}} units at <strong class="text-success">₹{{bid.amount}}</strong>
                        </div>
                        <div ng-if="bid.status == 'PENDING'">
                            <button class="btn btn-sm btn-success rounded-pill" ng-click="updateBid(bid, 'ACCEPTED')">Accept</button>
                            <button class="btn btn-sm btn-outline-danger rounded-pill" ng-click="updateBid(bid, 'REJECTED')">Reject</button>
                        </div>
                        <div ng-if="bid.status != 'PENDING'" class="badge" ng-class="{'bg-success': bid.status=='ACCEPTED', 'bg-danger': bid.status=='REJECTED'}">{{bid.status}}</div>
                    </div>
                    <div ng-if="getBidsForProduct(item.id, 'buy').length == 0" class="text-muted small">No sellers yet.</div>
                </div>
            </div>
        </div>

        <!-- TAB CONTENT: MY BIDS -->
        <div ng-show="activeTab == 'bids'">
            <h5 class="fw-bold mb-3">My Offers</h5>
            <div class="row">
                <div class="col-md-6" ng-repeat="bid in myBids">
                    <div class="feature-box p-3 mb-3">
                        <div class="d-flex justify-content-between">
                            <span class="fw-bold small text-muted">BID #{{bid.id}}</span>
                            <span class="badge" ng-class="{'bg-warning text-dark': bid.status=='PENDING', 'bg-success': bid.status=='ACCEPTED', 'bg-danger': bid.status=='REJECTED'}">{{bid.status}}</span>
                        </div>
                        <h5 class="mt-2">Offered: <span class="text-success fw-bold">₹{{bid.amount}}</span></h5>
                        <p class="small text-muted">For {{bid.quantity}} units</p>
                        <div ng-if="bid.status == 'ACCEPTED'" class="alert alert-success py-1 small fw-bold">Bid Accepted! Check post for contact.</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
```

---

## File: frontend/product_bid.html
```html
# Path: frontend/product_bid.html
<!DOCTYPE html>
<html lang="en" ng-app="userApp">
<head>
    <meta charset="UTF-8">
    <title>Bids - Agrivendia</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
    <script src="app.js"></script>
    <style>
        body { font-family: 'Poppins', sans-serif; background-color: #F1F8E9; }
        .navbar { background: white; box-shadow: 0 4px 15px rgba(0,0,0,0.05); padding: 15px 0; }
        .navbar-brand { font-weight: 700; color: #2E7D32 !important; }
        .btn-back { background: #e8f5e9; color: #2E7D32; border: none; border-radius: 50px; padding: 5px 15px; font-weight: 500; transition: 0.3s; }
        .btn-back:hover { background: #2E7D32; color: white; }
        .admin-card { background: white; border: none; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); overflow: hidden; height: 100%; }
        .card-header-custom { background: #2E7D32; color: white; padding: 20px; font-weight: 600; display: flex; align-items: center; }
        .form-control { background: #f9f9f9; border: 1px solid #eee; border-radius: 8px; padding: 12px; }
        .form-control:focus { border-color: #2E7D32; background: white; box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1); }
        .btn-submit { background: #2E7D32; color: white; border: none; padding: 12px; border-radius: 8px; font-weight: 600; width: 100%; transition: 0.3s; }
        .btn-submit:hover { background: #1B5E20; transform: translateY(-2px); }
        .custom-table thead th { background: #f1f8e9; color: #2E7D32; border: none; padding: 15px; font-weight: 600; }
        .custom-table tbody td { padding: 15px; border-bottom: 1px solid #eee; vertical-align: middle; }
        .action-btn { width: 35px; height: 35px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; border: none; transition: 0.2s; margin-left: 5px; }
        .btn-edit { background: #e3f2fd; color: #1976d2; }
        .btn-delete { background: #ffebee; color: #d32f2f; }
    </style>
</head>
<body ng-controller="ProductBidCtrl">
    <nav class="navbar sticky-top mb-5">
        <div class="container">
            <a class="navbar-brand" href="index.html">Agrivendia <span class="badge bg-success rounded-pill small ms-2">Admin</span></a>
            <a href="index.html" class="btn-back"><i class="bi bi-arrow-left"></i> Dashboard</a>
        </div>
    </nav>
    <div class="container">
        <div class="row g-4">
            <div class="col-lg-4">
                <div class="admin-card">
                    <div class="card-header-custom"><i class="bi bi-hammer me-2"></i> {{ product_bid.id ? 'Edit' : 'Place' }} Bid</div>
                    <div class="p-4">
                        <form ng-submit="saveProductBid()">
                            <div class="mb-3">
                                <label class="small fw-bold text-muted">SELLER</label>
                                <input type="text" class="form-control" ng-model="product_bid.productSeller" required>
                            </div>
                            <div class="row g-2 mb-3">
                                <div class="col-6">
                                    <label class="small fw-bold text-muted">COST ($)</label>
                                    <input type="number" step="0.01" class="form-control" ng-model="product_bid.productCost" required>
                                </div>
                                <div class="col-6">
                                    <label class="small fw-bold text-muted">QTY</label>
                                    <input type="number" class="form-control" ng-model="product_bid.quantity" required>
                                </div>
                            </div>
                            <div class="mb-4">
                                <label class="small fw-bold text-muted">DESCRIPTION</label>
                                <textarea class="form-control" ng-model="product_bid.description" rows="2" required></textarea>
                            </div>
                            <button type="submit" class="btn-submit shadow-sm">{{ product_bid.id ? 'Update Bid' : 'Place Bid' }}</button>
                        </form>
                    </div>
                </div>
            </div>
            <div class="col-lg-8">
                <div class="admin-card">
                    <div class="p-4 border-bottom"><h5 class="fw-bold m-0 text-success">Active Bids</h5></div>
                    <div class="table-responsive">
                        <table class="table custom-table mb-0">
                            <thead><tr><th>Seller</th><th>Details</th><th>Description</th><th class="text-end">Actions</th></tr></thead>
                            <tbody>
                                <tr ng-repeat="p in product_bids">
                                    <td class="fw-bold text-dark">{{p.productSeller}}</td>
                                    <td>
                                        <div class="fw-bold text-success">${{p.productCost}}</div>
                                        <div class="small text-muted">Qty: {{p.quantity}}</div>
                                    </td>
                                    <td class="small text-muted">{{p.description}}</td>
                                    <td class="text-end">
                                        <button class="action-btn btn-edit" ng-click="editProductBid(p)"><i class="bi bi-pencil-fill"></i></button>
                                        <button class="action-btn btn-delete" ng-click="deleteProductBid(p.id)"><i class="bi bi-trash-fill"></i></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
```

---

## File: frontend/market.html
```html
# Path: frontend/market.html
<!DOCTYPE html>
<html lang="en" ng-app="userApp">
<head>
    <meta charset="UTF-8">
    <title>Marketplace - Agrivendia</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="css/styles.css" rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
    <script src="app.js"></script>
    <style>
        .filter-sidebar { background: white; border-radius: 12px; border: 1px solid #eee; position: sticky; top: 90px; }
        .filter-section { padding: 20px; border-bottom: 1px solid #f0f0f0; }
    </style>
</head>
<body ng-controller="MarketCtrl">

    <div ng-include="'components/navbar.html'" ng-init="activePage='market'"></div>

    <div class="container py-5">
        <div class="row g-4">
            <!-- SIDEBAR -->
            <div class="col-lg-3">
                <div class="filter-sidebar">
                    <div class="p-3 bg-light border-bottom d-flex justify-content-between align-items-center">
                        <h6 class="m-0 fw-bold"><i class="bi bi-sliders"></i> Filters</h6>
                        <a href="#" class="small text-danger fw-bold" ng-click="resetFilters()">Reset</a>
                    </div>
                    <div class="filter-section">
                        <div class="small fw-bold text-uppercase text-muted mb-3">Type</div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="type" ng-model="filters.type" value="sell" ng-change="applyFilters()">
                            <label class="form-check-label">For Sale</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="type" ng-model="filters.type" value="buy" ng-change="applyFilters()">
                            <label class="form-check-label">Buy Requests</label>
                        </div>
                    </div>
                    <div class="filter-section">
                        <div class="small fw-bold text-uppercase text-muted mb-3">Location</div>
                        <select class="form-select form-select-sm" ng-model="filters.location" ng-change="applyFilters()">
                            <option value="">All Locations</option>
                            <option ng-repeat="loc in locations" value="{{loc}}">{{loc}}</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- CONTENT -->
            <div class="col-lg-9">
                <div class="position-relative mb-4">
                    <input type="text" class="form-control rounded-pill py-3 px-4" placeholder="Search crops..." ng-model="filters.search" ng-change="applyFilters()">
                    <button class="position-absolute top-50 end-0 translate-middle-y btn btn-success rounded-circle m-1" style="width:40px; height:40px;"><i class="bi bi-search"></i></button>
                </div>

                <div class="row g-4">
                    <div class="col-md-4 col-sm-6" ng-repeat="item in filteredItems">
                        <div class="ecom-card" ng-click="openItem(item)">
                            <div class="card-img-wrap">
                                <img ng-src="{{item.productImage}}" class="img-fluid" ng-if="item.productImage">
                                <div ng-if="!item.productImage" class="d-flex align-items-center justify-content-center h-100 bg-light text-muted">
                                    <i class="bi bi-image display-4"></i>
                                </div>
                                <div class="badge-custom" ng-if="item.trusted"><i class="bi bi-patch-check-fill"></i> Verified</div>
                                <div class="badge-custom badge-buy" ng-if="item.type === 'buy'">WANTED</div>
                            </div>

                            <div class="p-3 d-flex flex-column flex-grow-1">
                                <div class="prod-title">{{item.productName}}</div>
                                <span class="d-block text-muted small mb-2"><i class="bi bi-geo-alt-fill text-danger"></i> {{item.location}}</span>
                                <div class="bg-light rounded p-2 mb-3 mt-auto">
                                    <div class="small fw-bold text-uppercase text-muted" style="font-size:0.65rem">Stock</div>
                                    <div class="fw-bold">{{item.quantity}} Units</div>
                                </div>
                                <div class="d-flex justify-content-between align-items-center">
                                    <div class="price-tag" ng-class="{'text-price-sell': item.type==='sell', 'text-price-buy': item.type==='buy'}">₹{{item.price}}</div>
                                    <button class="btn btn-sm btn-light text-success"><i class="bi" ng-class="{'bi-plus-lg': item.type==='sell', 'bi-telephone-fill': item.type==='buy'}"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div ng-include="'components/footer.html'"></div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
```

---

## File: frontend/product.html
```html
# Path: frontend/product.html
<!DOCTYPE html>
<html lang="en" ng-app="userApp">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Products - Agrivendia</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
    <script src="app.js"></script>
    <style>
        body { font-family: 'Poppins', sans-serif; background-color: #F1F8E9; }
        .navbar { background: linear-gradient(135deg, #2E7D32 0%, #43A047 100%); box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        .navbar-brand { font-weight: 600; letter-spacing: 0.5px; }
        .card { border: none; border-radius: 15px; box-shadow: 0 5px 20px rgba(0,0,0,0.05); overflow: hidden; }
        .card-header { background: white; border-bottom: 1px solid #f0f0f0; padding: 20px; font-weight: 600; color: #2E7D32; font-size: 1.1rem; }
        .form-control { border-radius: 8px; padding: 10px 15px; border: 1px solid #e0e0e0; background-color: #f9f9f9; }
        .form-control:focus { background-color: white; border-color: #2E7D32; box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1); }
        .form-label { font-size: 0.85rem; font-weight: 600; color: #666; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px; }
        .btn-success { background: #2E7D32; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 500; }
        .btn-success:hover { background: #1B5E20; }
        .table thead th { background-color: #2E7D32; color: white; font-weight: 500; border: none; padding: 15px; }
        .table tbody td { padding: 15px; vertical-align: middle; border-bottom: 1px solid #f0f0f0; }
        .action-btn { width: 35px; height: 35px; display: inline-flex; align-items: center; justify-content: center; border-radius: 8px; margin-left: 5px; transition: 0.2s; }
        .btn-edit { background: #e3f2fd; color: #1976d2; border: none; } 
        .btn-del { background: #ffebee; color: #d32f2f; border: none; }
    </style>
</head>
<body class="bg-light" ng-controller="ProductCtrl">
    <nav class="navbar navbar-expand-lg navbar-dark mb-5 sticky-top">
        <div class="container">
            <a class="navbar-brand" href="index.html"><i class="bi bi-arrow-left-circle me-2"></i> Dashboard</a>
            <span class="text-white opacity-75">Products</span>
        </div>
    </nav>
    <div class="container">
        <h2 class="fw-bold text-dark mb-4">Product List</h2>
        <div class="row g-4">
            <div class="col-lg-4">
                <div class="card h-100">
                    <div class="card-header"><i class="bi bi-box-seam me-2"></i> {{ product.id ? 'Edit' : 'Add' }} Product</div>
                    <div class="card-body p-4">
                        <form ng-submit="saveProduct()">
                            <div class="mb-3">
                                <label class="form-label">Name</label>
                                <input type="text" class="form-control" ng-model="product.productName" required>
                            </div>
                            <div class="mb-4">
                                <label class="form-label">Description</label>
                                <input type="text" class="form-control" ng-model="product.productDescription" required>
                            </div>
                            <button type="submit" class="btn btn-success w-100 shadow-sm">{{ product.id ? 'Update' : 'Add' }}</button>
                        </form>
                    </div>
                </div>
            </div>
            <div class="col-lg-8">
                <div class="card">
                    <table class="table mb-0">
                        <thead><tr><th>Name</th><th>Description</th><th class="text-end">Actions</th></tr></thead>
                        <tbody>
                            <tr ng-repeat="p in products">
                                <td class="fw-bold text-dark">{{p.productName}}</td>
                                <td class="small text-muted">{{p.productDescription}}</td>
                                <td class="text-end">
                                    <button class="action-btn btn-edit" ng-click="editProduct(p)"><i class="bi bi-pencil-fill"></i></button>
                                    <button class="action-btn btn-del" ng-click="deleteProduct(p.id)"><i class="bi bi-trash-fill"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
```

---

## File: frontend/login.html
```html
# Path: frontend/login.html
<!DOCTYPE html>
<html lang="en" ng-app="userApp">
<head>
    <meta charset="UTF-8">
    <title>Login - Agrivendia</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="css/styles.css" rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
    <script src="app.js"></script>
    <style>
        .auth-wrapper { background: url('https://www.transparenttextures.com/patterns/cubes.png'); }
    </style>
</head>
<body ng-controller="AuthCtrl" class="bg-white">
    <div ng-include="'components/navbar.html'"></div>

    <div class="auth-wrapper">
        <div class="login-box bg-white shadow rounded border">
            <h3 class="fw-bold text-center mb-1">Welcome Back</h3>
            <p class="text-center text-muted mb-4">Login to access market</p>
            <form ng-submit="loginCustomer()">
                <div class="mb-3">
                    <label class="form-label small fw-bold text-muted">EMAIL</label>
                    <input type="email" class="form-control" ng-model="loginData.email" required>
                </div>
                <div class="mb-4">
                    <label class="form-label small fw-bold text-muted">PASSWORD</label>
                    <input type="password" class="form-control" ng-model="loginData.password" required>
                    <div class="text-end mt-1"><a href="forgot_password.html" class="small text-success">Forgot Password?</a></div>
                </div>
                <button type="submit" class="btn-success-custom w-100">Login</button>
            </form>
            <div class="text-center mt-3 small">
                New here? <a href="register.html" class="fw-bold text-success">Create Account</a>
            </div>
        </div>
    </div>
</body>
</html>
```

---

## File: frontend/product_buy.html
```html
# Path: frontend/product_buy.html
<!DOCTYPE html>
<html lang="en" ng-app="userApp">
<head>
    <meta charset="UTF-8">
    <title>Request Product - Agrivendia</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link href="css/styles.css" rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
    <script src="app.js"></script>
</head>
<body ng-controller="ProductBuyCtrl" style="background-color: #e3f2fd;">
    
    <div ng-include="'components/admin_navbar.html'"></div>

    <div class="container">
        <div class="form-card mx-auto p-4" style="max-width:600px;">
            <h3 class="fw-bold text-center mb-4 text-primary">Post Requirement</h3>
            <form ng-submit="saveProductBuy()">
                <div class="row g-3 mb-3">
                    <div class="col-6">
                        <label class="small fw-bold text-muted">Category</label>
                        <select class="form-select" ng-model="product_buy.category" ng-change="loadProducts()" required>
                            <option ng-repeat="c in categories" value="{{c.id}}">{{c.name}}</option>
                        </select>
                    </div>
                    <div class="col-6">
                        <label class="small fw-bold text-muted">Product</label>
                        <select class="form-select" ng-model="product_buy.product" required ng-disabled="!product_buy.category">
                            <option ng-repeat="p in productsList" value="{{p.id}}">{{p.productName}}</option>
                        </select>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="small fw-bold text-muted">Requirements</label>
                    <input type="text" class="form-control" ng-model="product_buy.name" placeholder="Specific variety?">
                </div>
                <div class="mb-3">
                    <label class="small fw-bold text-muted">Ref Image (Optional)</label>
                    <input type="file" class="form-control" fileread="product_buy.image" accept="image/*">
                </div>
                <div class="row g-3 mb-3">
                    <div class="col-6"><label class="small fw-bold text-muted">Target Price</label><input type="number" class="form-control" ng-model="product_buy.price" required></div>
                    <div class="col-6"><label class="small fw-bold text-muted">Qty Needed</label><input type="number" class="form-control" ng-model="product_buy.quantity" required></div>
                </div>
                <div class="mb-4"><label class="small fw-bold text-muted">Delivery Location</label><input type="text" class="form-control" ng-model="product_buy.location" required></div>
                
                <button type="submit" class="btn btn-primary w-100 rounded-pill fw-bold py-2" ng-disabled="isSubmitting">
                    {{ isSubmitting ? 'Processing...' : 'Post Request' }}
                </button>
            </form>
        </div>
    </div>
</body>
</html>
```

---

## File: frontend/product_detail.html
```html
# Path: frontend/product_detail.html
<!DOCTYPE html>
<html lang="en" ng-app="userApp">
<head>
    <meta charset="UTF-8">
    <title>Product Details</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link href="css/styles.css" rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
    <script src="app.js"></script>
</head>
<body ng-controller="ProductDetailCtrl">

    <div ng-include="'components/admin_navbar.html'"></div>

    <div class="container feature-box p-4" style="max-width: 1000px;">
        <div class="row">
            <div class="col-md-5">
                <img ng-src="{{ product.image ? 'http://127.0.0.1:8000' + product.image : (product.productImage || 'https://via.placeholder.com/400') }}" class="img-fluid rounded shadow-sm w-100" style="height: 350px; object-fit: cover;">
            </div>
            <div class="col-md-7">
                <h2 class="fw-bold">{{product.productName || product.buyerName}}</h2>
                <h5 class="text-muted" ng-if="product.name && product.name != 'General'">{{product.name}}</h5>
                <p class="text-muted mt-2"><i class="bi bi-geo-alt-fill"></i> {{product.location}}</p>
                <h3 class="fw-bold" ng-class="{'text-success': product.type=='sell', 'text-primary': product.type=='buy'}">₹ {{product.price}} <span class="fs-6 text-muted">/ Unit</span></h3>
                
                <div class="p-3 bg-light rounded mt-3">
                    <strong>Description:</strong>
                    <p class="mb-0 text-muted">{{product.description || 'No description provided.'}}</p>
                </div>
                <div class="mt-4">
                    <label class="small fw-bold text-muted">CONTACT</label>
                    <h5>{{product.sellerName || product.buyerName}}</h5>
                    <div ng-if="isOwner" class="alert alert-info py-2 mt-2"><i class="bi bi-info-circle"></i> This is your post.</div>
                </div>
            </div>
        </div>

        <hr class="my-5">

        <div class="row">
            <div class="col-12"><h4 class="fw-bold mb-4">Market Activity</h4></div>
            
            <div class="col-md-5" ng-if="!isOwner">
                <div class="bg-light p-4 rounded border">
                    <h5 class="fw-bold mb-3">Place Your Bid</h5>
                    <form ng-submit="placeBid()">
                        <div class="mb-3">
                            <label class="form-label">Quantity</label>
                            <input type="number" class="form-control" ng-model="bid.quantity" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Your Price (₹)</label>
                            <input type="number" class="form-control" ng-model="bid.amount" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Message / Note</label>
                            <textarea class="form-control" rows="2" ng-model="bid.message" placeholder="e.g. Can pick up tomorrow..."></textarea>
                        </div>
                        <button type="submit" class="btn btn-success-custom w-100">Submit Bid</button>
                    </form>
                </div>
            </div>

            <div class="col-md-7" ng-class="{'col-md-12': isOwner}">
                <div ng-if="bids.length == 0" class="text-center py-5 text-muted"><i class="bi bi-inbox fs-1"></i><p>No bids yet.</p></div>
                <div class="border rounded p-3 mb-2" ng-repeat="b in bids" ng-class="{'bg-success-subtle border-success': b.status === 'ACCEPTED'}">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <div class="fw-bold">{{b.bidder_details.name}}</div>
                            <div class="text-muted small">{{b.quantity}} Units at <strong>₹{{b.amount}}</strong></div>
                            <div class="small text-dark mt-1" ng-if="b.message"><em>"{{b.message}}"</em></div>
                        </div>
                        <div class="text-end">
                            <span class="badge mb-2 d-block" ng-class="{'bg-warning text-dark': b.status=='PENDING', 'bg-success': b.status=='ACCEPTED', 'bg-danger': b.status=='REJECTED'}">{{b.status}}</span>
                            <div ng-if="isOwner && b.status === 'PENDING'">
                                <button class="btn btn-sm btn-success me-1" ng-click="updateBidStatus(b, 'ACCEPTED')"><i class="bi bi-check-lg"></i></button>
                                <button class="btn btn-sm btn-danger" ng-click="updateBidStatus(b, 'REJECTED')"><i class="bi bi-x-lg"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
```

---

## File: frontend/admin_login.html
```html
# Path: frontend/admin_login.html
<!DOCTYPE html>
<html lang="en" ng-app="userApp">
<head>
    <meta charset="UTF-8">
    <title>Admin Portal - Agrivendia</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
    <script src="app.js"></script>
    <style>
        body { background: #263238; height: 100vh; display: flex; align-items: center; justify-content: center; }
        .admin-card { width: 400px; background: white; padding: 40px; border-radius: 10px; text-align: center; }
        .btn-dark-custom { background: #37474F; color: white; width: 100%; padding: 10px; border: none; border-radius: 5px; }
        .btn-dark-custom:hover { background: #263238; }
    </style>
</head>
<body ng-controller="AuthCtrl">
    <div class="admin-card">
        <h4 class="mb-4">System Administrator</h4>
        <form ng-submit="loginAdmin()">
            <div class="mb-3">
                <input type="email" class="form-control" ng-model="loginData.email" placeholder="Admin Email" required>
            </div>
            <div class="mb-3">
                <input type="password" class="form-control" ng-model="loginData.password" placeholder="Password" required>
            </div>
            <button type="submit" class="btn-dark-custom">Access Dashboard</button>
        </form>
        <a href="login.html" class="d-block mt-3 text-muted small">Back to Site</a>
    </div>
</body>
</html>
```

---

## File: frontend/forgot_password.html
```html
# Path: frontend/forgot_password.html
<!DOCTYPE html>
<html lang="en" ng-app="userApp">
<head>
    <meta charset="UTF-8">
    <title>Reset Password - Agrivendia</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link href="css/styles.css" rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
    <script src="app.js"></script>
    <style>[ng-cloak]{display:none!important}</style>
</head>
<body ng-controller="ForgotPassCtrl" ng-cloak style="background: #e0f2f1; height: 100vh; display: flex; align-items: center; justify-content: center;">
    <div class="reg-card" style="width: 450px;">
        <h4 class="text-center fw-bold text-success mb-4">Reset Password</h4>
        
        <div ng-show="step == 1">
            <form ng-submit="sendOtp()">
                <div class="mb-3"><label class="small fw-bold text-muted">PHONE</label><input type="text" class="form-control" ng-model="data.phone" required></div>
                <div class="mb-3"><label class="small fw-bold text-muted">CHAT ID</label><input type="text" class="form-control" ng-model="data.chat_id" required></div>
                <button type="submit" class="btn-success-custom w-100">Send OTP</button>
            </form>
        </div>

        <div ng-show="step == 2">
            <div class="alert alert-info py-2 small text-center">OTP Sent!</div>
            <form ng-submit="verifyOtp()">
                <div class="mb-3 text-center"><input type="text" class="form-control text-center fs-4" ng-model="data.otp" maxlength="4" placeholder="0000" required></div>
                <button type="submit" class="btn-success-custom w-100">Verify</button>
            </form>
        </div>

        <div ng-show="step == 3">
            <form ng-submit="resetPassword()">
                <div class="mb-3"><input type="password" class="form-control" ng-model="data.new_pass" placeholder="New Password" required></div>
                <div class="mb-3"><input type="password" class="form-control" ng-model="data.confirm_pass" placeholder="Confirm" required></div>
                <button type="submit" class="btn-success-custom w-100">Update Password</button>
            </form>
        </div>

        <div class="text-center mt-3 border-top pt-3"><a href="login.html" class="text-muted small">Back to Login</a></div>
    </div>
</body>
</html>
```

---

## File: frontend/register.html
```html
# Path: frontend/register.html
<!DOCTYPE html>
<html lang="en" ng-app="userApp">
<head>
    <meta charset="UTF-8">
    <title>Sign Up - Agrivendia</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link href="css/styles.css" rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
    <script src="app.js"></script>
</head>
<body ng-controller="AuthCtrl" style="background: #f4f7f6;">
    <div ng-include="'components/navbar.html'"></div>
    
    <div class="d-flex align-items-center justify-content-center" style="min-height:80vh;">
        <div class="reg-card bg-white shadow-sm rounded border p-5" style="max-width:500px; width:100%;">
            <h3 class="fw-bold text-success text-center mb-4">Create Account</h3>
            <form ng-submit="register()">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="small fw-bold text-muted">Name</label>
                        <input type="text" class="form-control" ng-model="regData.name" required>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="small fw-bold text-muted">Phone</label>
                        <input type="text" class="form-control" ng-model="regData.phone" required>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="small fw-bold text-muted">Email</label>
                    <input type="email" class="form-control" ng-model="regData.email" required>
                </div>
                <div class="mb-3">
                    <label class="small fw-bold text-muted">Address</label>
                    <textarea class="form-control" ng-model="regData.address" rows="2" required></textarea>
                </div>
                <div class="row mb-4">
                    <div class="col-md-6">
                         <label class="small fw-bold text-muted">Password</label>
                         <input type="password" class="form-control" ng-model="regData.password" required>
                    </div>
                    <div class="col-md-6">
                         <label class="small fw-bold text-muted">Confirm</label>
                         <input type="password" class="form-control" ng-model="regData.confirm_password" required>
                    </div>
                </div>
                <button type="submit" class="btn-success-custom w-100 rounded">Register</button>
            </form>
            <div class="text-center mt-3 small">
                Already have an account? <a href="login.html" class="text-success fw-bold">Login</a>
            </div>
        </div>
    </div>
</body>
</html>
```

---

## File: frontend/app.js
```js
# Path: frontend/app.js
// Path: frontend/app.js
var app = angular.module('userApp', []);

// --- 0. NEW DIRECTIVE: FILE READER ---
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

// --- 1. GLOBAL SESSION MANAGER ---
app.run(function($window, $rootScope) {
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
    $rootScope.checkSession();
});

// --- 2. MARKETPLACE CONTROLLER ---
app.controller('MarketplaceCtrl', function ($scope, $http, $window, $q) {
    var API_URL = "http://127.0.0.1:8000/";
    $scope.searchText = ""; 
    
    $scope.goToMarket = function() {
        $window.location.href = 'market.html?q=' + encodeURIComponent($scope.searchText);
    };

    $scope.openProduct = function(p) {
        $window.location.href = 'product_detail.html?id=' + p.id + '&type=' + p.type;
    };

    var sellRequest = $http.get(API_URL + "product_sell/");
    var buyRequest = $http.get(API_URL + "product_buy/");

    $q.all([sellRequest, buyRequest]).then(function (results) {
        var sales = results[0].data.map(function(item) { item.type = 'sell'; return item; });
        var buys = results[1].data.map(function(item) { 
            item.type = 'buy';
            item.displayName = "Wanted: " + (item.productName || item.buyerName); 
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
            var name = (p.productName || "").toLowerCase();
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

// --- 3. MARKET CONTROLLER ---
app.controller('MarketCtrl', function ($scope, $http, $q, $window) {
    var API_URL = "http://127.0.0.1:8000/";
    
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

    var sellReq = $http.get(API_URL + "product_sell/", config);
    var buyReq = $http.get(API_URL + "product_buy/", config);

    $q.all([sellReq, buyReq]).then(function(results) {
        var sales = results[0].data.map(function(i) { i.type = 'sell'; i.trusted = true; return i; });
        var buys = results[1].data.map(function(i) { 
            i.type = 'buy'; 
            i.productName = "Wanted: " + i.productName; 
            return i; 
        });

        $scope.allItems = sales.concat(buys);
        $scope.filteredItems = $scope.allItems; 

        var lSet = new Set();
        $scope.allItems.forEach(function(item) {
            if(item.location) lSet.add(item.location.trim());
        });
        $scope.locations = Array.from(lSet).sort();

        if(searchQuery) $scope.applyFilters();
    });

    $scope.resetFilters = function() {
        $window.location.href = "market.html";
    };

    $scope.applyFilters = function() {
        var f = $scope.filters;
        var term = f.search.toLowerCase();

        $scope.filteredItems = $scope.allItems.filter(function(item) {
            if (f.type !== 'all' && f.type && item.type !== f.type) return false;
            
            var textMatch = (item.productName && item.productName.toLowerCase().includes(term)) || 
                            (item.location && item.location.toLowerCase().includes(term));
            if (!textMatch) return false;
            
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
app.controller('ProductDetailCtrl', function ($scope, $http, $window, $rootScope) {
    var API_URL = "http://127.0.0.1:8000/";
    var urlParams = new URLSearchParams(window.location.search);
    var id = urlParams.get('id');
    var type = urlParams.get('type') || 'sell'; 

    $scope.bid = { quantity: 1, amount: "", message: "" }; // Added message
    $scope.bids = [];
    $scope.isOwner = false;

    if (id) {
        var endpoint = (type === 'buy') ? "product_buy/" : "product_sell/";
        $http.get(API_URL + endpoint + id + "/").then(function (res) {
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
        $http.get(API_URL + "product_bid/?" + param + id).then(function(res){
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
            message: $scope.bid.message || "Interested", // Send user message
            status: "PENDING"
        };
        if (type === 'buy') bidData.buy_post = id;
        else bidData.sell_post = id;

        $http.post(API_URL + "product_bid/", bidData).then(function() {
            alert("Bid Placed Successfully!");
            $scope.bid = { quantity: 1, amount: "", message: "" }; // Reset form
            loadBids();
        }, function() { alert("Error placing bid. Please try again."); });
    };

    $scope.updateBidStatus = function(bid, status) {
        $http.put(API_URL + "product_bid/" + bid.id + "/", { status: status }).then(function() {
            bid.status = status;
        });
    };
});

// --- 5. CATEGORY PAGE ---
app.controller('CategoryPageCtrl', function ($scope, $http, $window) {
    var API_URL = "http://127.0.0.1:8000/";
    $scope.categories = [];
    $http.get(API_URL + "category/").then(function (res) {
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
app.controller('AuthCtrl', function ($scope, $http, $window) {
    var BASE_URL = "http://127.0.0.1:8000/";
    $scope.loginData = {};
    $scope.regData = {};

    $scope.loginCustomer = function () {
        $http.post(BASE_URL + "customer/login/", $scope.loginData).then(function (res) {
            $window.sessionStorage.setItem('currentUser', JSON.stringify(res.data));
            $window.location.href = 'customer_dashboard.html';
        }, function() { alert("Invalid Credentials"); });
    };

    $scope.loginAdmin = function () {
        $http.post(BASE_URL + "user/login/", $scope.loginData).then(function (res) {
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
        // Remove confirm_password before sending
        var payload = angular.copy($scope.regData);
        delete payload.confirm_password;

        $http.post(BASE_URL + "customer/", payload).then(function () {
            alert("Registration Successful! Please Login.");
            $window.location.href = 'login.html';
        }, function(err) { 
            var msg = err.data.email ? "Email already exists." : "Registration Failed.";
            alert(msg); 
        });
    };
});

// --- 7. PLAN CONTROLLER ---
app.controller('PlanCtrl', function ($scope, $http) {
    $http.get("http://127.0.0.1:8000/plan/").then(function(res){ $scope.plans = res.data; });
});

// --- 8. ADMIN DASHBOARD CONTROLLER ---
app.controller('AdminDashCtrl', function ($scope, $http, $window) {
    var API_URL = "http://127.0.0.1:8000/";
    $scope.activeTab = 'products'; 
    $scope.tableData = [];
    $scope.currentItem = {};
    $scope.currentSchema = [];
    $scope.categories = []; // Store categories for dropdown

    // Fetch categories immediately for dropdowns
    $http.get(API_URL + "category/").then(function(res){
        $scope.categories = res.data;
    });

    var schemas = {
        'products': [
            { key: 'productName', label: 'Product Name', type: 'text' },
            { key: 'category', label: 'Category', type: 'select', options: 'categories' }, // Changed to select
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

        $http.get(API_URL + endpoint).then(function(res) {
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

        $http.post(API_URL + "user/bulk-upload/" + modelSlug + "/", formData, {
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
            $http.put(API_URL + endpoint + $scope.currentItem.id + "/", payload).then(function() {
                alert("Updated!");
                $scope.switchTab($scope.activeTab);
                bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
            }, function(err) { alert("Error: " + JSON.stringify(err.data)); });
        } else {
            $http.post(API_URL + endpoint, payload).then(function() {
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

        $http.delete(API_URL + endpoint + id + "/").then(function() {
            $scope.switchTab($scope.activeTab);
        });
    };

    // Helper to get dropdown options from scope
    $scope.getOptions = function(optionName) {
        return $scope[optionName] || [];
    };
});

// --- 9. POST SELL LISTING ---
app.controller('ProductSellCtrl', function ($scope, $http, $rootScope, $window) { 
    var API_URL = "http://127.0.0.1:8000/";
    $scope.product_sell = {};
    $scope.categories = []; 
    $scope.productsList = []; 
    $scope.isSubmitting = false;

    $http.get(API_URL + "category/").then(function(res){ $scope.categories = res.data; });

    $scope.loadProducts = function() {
        if(!$scope.product_sell.category) return;
        $http.get(API_URL + "product/?category_id=" + $scope.product_sell.category)
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

        $http.post(API_URL + "product_sell/", $scope.product_sell).then(function(){ 
            alert("Success! Your produce is listed.");
            $window.location.href = "customer_dashboard.html"; 
        }, function(err){ 
            alert("Error posting product. Check your connection or image size."); 
            $scope.isSubmitting = false;
        });
    };
});

// --- 10. POST BUY REQUEST ---
app.controller('ProductBuyCtrl', function ($scope, $http, $rootScope, $window) { 
    var API_URL = "http://127.0.0.1:8000/";
    $scope.product_buy = {};
    $scope.categories = []; 
    $scope.productsList = [];
    $scope.isSubmitting = false;

    $http.get(API_URL + "category/").then(function(res){ $scope.categories = res.data; });

    $scope.loadProducts = function() {
        if(!$scope.product_buy.category) return;
        $http.get(API_URL + "product/?category_id=" + $scope.product_buy.category)
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
        if(!$scope.product_buy.buyerName) {
            $scope.product_buy.buyerName = $rootScope.currentUser.name;
        }
        $http.post(API_URL + "product_buy/", $scope.product_buy).then(function(){ 
            alert("Request Posted!");
            $window.location.href = "customer_dashboard.html";
        }, function(err){ 
            alert("Error posting request."); 
            $scope.isSubmitting = false;
        });
    };
});

// --- 11. USER CONTROLLER (SYSTEM ADMINS) ---
app.controller('UserCtrl', function ($scope, $http, $window) {
    var API_URL = "http://127.0.0.1:8000/";
    $scope.user = {};
    $scope.users = [];

    function loadUsers() {
        $http.get(API_URL + "user/").then(function(res) {
            $scope.users = res.data;
        });
    }
    loadUsers();

    $scope.saveUser = function() {
        if ($scope.user.id) {
            // Edit Mode (Password Optional)
            $http.put(API_URL + "user/" + $scope.user.id + "/", $scope.user).then(function() {
                alert("Admin updated!");
                $scope.user = {};
                loadUsers();
            }, function(err) { alert("Error updating admin."); });
        } else {
            // Create Mode (Password Required)
            if(!$scope.user.password) {
                alert("Password is required for new admins.");
                return;
            }
            $http.post(API_URL + "user/", $scope.user).then(function() {
                alert("New Admin created!");
                $scope.user = {};
                loadUsers();
            }, function(err) { alert("Error creating admin."); });
        }
    };

    $scope.editUser = function(u) {
        $scope.user = angular.copy(u);
        $scope.user.password = ""; // Don't show hash, allow overwrite
    };

    $scope.deleteUser = function(id) {
        if(confirm("Delete this admin?")) {
            $http.delete(API_URL + "user/" + id + "/").then(function() {
                loadUsers();
            });
        }
    };
});

// Customer Dashboard Controller
app.controller('CustomerDashCtrl', function ($scope, $http, $rootScope, $window) {
    var API_URL = "http://127.0.0.1:8000/";
    $scope.activeTab = 'sell';
    
    if(!$rootScope.currentUser) { window.location.href = 'login.html'; return; }

    $scope.myListings = [];
    $scope.myBuyRequests = [];
    $scope.incomingBids = [];
    $scope.myBids = [];
    $scope.incomingBidsCount = 0;

    $http.get(API_URL + "product_sell/?customer_id=" + $rootScope.currentUser.id).then(function(res) {
        $scope.myListings = res.data;
        fetchAllBids();
    });
    $http.get(API_URL + "product_buy/?customer_id=" + $rootScope.currentUser.id).then(function(res) {
        $scope.myBuyRequests = res.data;
    });

    function fetchAllBids() {
        $http.get(API_URL + "product_bid/").then(function(bidRes) {
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
        $http.put(API_URL + "product_bid/" + bid.id + "/", { status: status }).then(function() {
            bid.status = status;
        });
    };
    
    $scope.logout = function() {
        $window.sessionStorage.clear();
        $window.location.href = 'index.html';
    };
});
```

---

## File: frontend/index.html
```html
# Path: frontend/index.html
<!DOCTYPE html>
<html lang="en" ng-app="userApp">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Agrivendia - Farm Market</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="css/styles.css" rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
    <script src="app.js"></script>
</head>
<body ng-controller="MarketplaceCtrl">

    <div ng-include="'components/navbar.html'" ng-init="activePage='home'"></div>

    <!-- CAROUSEL -->
    <div id="heroCarousel" class="carousel slide carousel-fade" data-bs-ride="carousel">
        <div class="carousel-indicators">
            <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" class="active"></button>
            <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1"></button>
            <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="2"></button>
        </div>
        <div class="carousel-inner">
            <div class="carousel-item active">
                <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1932&auto=format&fit=crop" class="d-block w-100" alt="Farm">
                <div class="carousel-caption d-none d-md-block">
                    <h1>Fresh From Farm</h1>
                    <p class="fs-4">Direct marketplace connecting farmers and buyers.</p>
                </div>
            </div>
            <div class="carousel-item">
                <img src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=1770&auto=format&fit=crop" class="d-block w-100" alt="Veg">
                <div class="carousel-caption d-none d-md-block">
                    <h1>Organic & Pure</h1>
                    <p class="fs-4">Quality assured vegetables and fruits.</p>
                </div>
            </div>
            <div class="carousel-item">
                <img src="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=1772&auto=format&fit=crop" class="d-block w-100" alt="Grains">
                <div class="carousel-caption d-none d-md-block">
                    <h1>Fair Pricing</h1>
                    <p class="fs-4">Transparent rates for farmers and businesses.</p>
                </div>
            </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev"><span class="carousel-control-prev-icon"></span></button>
        <button class="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next"><span class="carousel-control-next-icon"></span></button>
    </div>

    <!-- SEARCH OVERLAP -->
    <div class="search-overlap">
        <form class="search-box" ng-submit="goToMarket()">
            <input type="text" class="search-input" ng-model="searchText" placeholder="Search for onions, wheat, apples...">
            <button type="submit" class="search-btn"><i class="bi bi-search"></i> Search</button>
        </form>
    </div>

    <!-- MAIN CONTENT -->
    <div class="container pb-5 mt-5">
        <div ng-repeat="section in homeSections" ng-if="section.items.length > 0">
            <div class="d-flex justify-content-between align-items-center mb-4 mt-5">
                <h3 class="fw-bold text-dark">{{section.title}}</h3>
                <a href="market.html?cat={{section.title}}" class="text-success fw-bold">View All <i class="bi bi-arrow-right"></i></a>
            </div>

            <div class="row g-4">
                <div class="col-lg-3 col-md-4 col-sm-6" ng-repeat="p in section.items | limitTo:4">
                    <div class="product-card" ng-click="openProduct(p)">
                        <div class="prod-img">
                            <i class="bi bi-box-seam"></i>
                            <div class="prod-badge"><i class="bi bi-check-circle-fill text-success"></i> Verified</div>
                        </div>
                        <div class="prod-details">
                            <div class="prod-title">{{p.productName}}</div>
                            <div class="prod-loc"><i class="bi bi-geo-alt"></i> {{p.location}}</div>
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="prod-price">₹{{p.price}}</div>
                                <small class="text-muted">{{p.quantity}} Qty</small>
                            </div>
                            <button class="btn-card-view">Buy Now</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="text-center py-5" ng-if="homeSections.length === 0">
            <div class="spinner-border text-success" role="status"></div>
            <p class="mt-2 text-muted">Loading fresh produce...</p>
        </div>
    </div>

    <div ng-include="'components/footer.html'"></div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
```

---

## File: frontend/plan.html
```html
# Path: frontend/plan.html
<!DOCTYPE html>
<html lang="en" ng-app="userApp">
<head>
    <meta charset="UTF-8">
    <title>Plans - Agrivendia</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link href="css/styles.css" rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
    <script src="app.js"></script>
</head>
<body ng-controller="PlanCtrl">
    <div ng-include="'components/navbar.html'" ng-init="activePage='plan'"></div>

    <div class="container py-5">
        <h1 class="text-center fw-bold mb-5">Membership Plans</h1>
        <div class="row g-4 justify-content-center">
            <div class="col-lg-4" ng-repeat="p in plans">
                <div class="plan-card p-5 text-center h-100">
                    <h3 class="fw-bold">{{p.name}}</h3>
                    <div class="display-3 fw-bold text-success my-3">₹{{p.price}}</div>
                    <p class="text-muted">per {{p.duration}}</p>
                    <hr>
                    <ul class="list-unstyled text-start mb-4">
                        <li><i class="bi bi-check-circle-fill text-success me-2"></i> Unlimited Listings</li>
                        <li><i class="bi bi-check-circle-fill text-success me-2"></i> Verified Badge</li>
                        <li><i class="bi bi-check-circle-fill text-success me-2"></i> Priority Support</li>
                    </ul>
                    <button class="btn btn-success-custom w-100 rounded-pill">Select Plan</button>
                </div>
            </div>
        </div>
    </div>
    
    <div ng-include="'components/footer.html'"></div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
```

---

## File: frontend/customer.html
```html
# Path: frontend/customer.html
<!DOCTYPE html>
<html lang="en" ng-app="userApp">
<head>
    <meta charset="UTF-8">
    <title>Customers - Agrivendia</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
    <script src="app.js"></script>
    <style>
        body { font-family: 'Poppins', sans-serif; background-color: #F1F8E9; }
        .navbar { background: white; box-shadow: 0 4px 15px rgba(0,0,0,0.05); padding: 15px 0; }
        .navbar-brand { font-weight: 700; color: #2E7D32 !important; }
        .btn-back { background: #e8f5e9; color: #2E7D32; border: none; border-radius: 50px; padding: 5px 15px; font-weight: 500; transition: 0.3s; }
        .btn-back:hover { background: #2E7D32; color: white; }
        .admin-card { background: white; border: none; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); overflow: hidden; height: 100%; }
        .card-header-custom { background: #2E7D32; color: white; padding: 20px; font-weight: 600; display: flex; align-items: center; }
        .form-control { background: #f9f9f9; border: 1px solid #eee; border-radius: 8px; padding: 12px; }
        .form-control:focus { border-color: #2E7D32; background: white; box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1); }
        .btn-submit { background: #2E7D32; color: white; border: none; padding: 12px; border-radius: 8px; font-weight: 600; width: 100%; transition: 0.3s; }
        .btn-submit:hover { background: #1B5E20; transform: translateY(-2px); }
        .custom-table thead th { background: #f1f8e9; color: #2E7D32; border: none; padding: 15px; font-weight: 600; }
        .custom-table tbody td { padding: 15px; border-bottom: 1px solid #eee; vertical-align: middle; }
        .action-btn { width: 35px; height: 35px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; border: none; transition: 0.2s; margin-left: 5px; }
        .btn-edit { background: #e3f2fd; color: #1976d2; }
        .btn-delete { background: #ffebee; color: #d32f2f; }
    </style>
</head>
<body ng-controller="CustomerCtrl">
    <nav class="navbar sticky-top mb-5">
        <div class="container">
            <a class="navbar-brand" href="index.html">Agrivendia <span class="badge bg-success rounded-pill small ms-2">Admin</span></a>
            <a href="index.html" class="btn-back"><i class="bi bi-arrow-left"></i> Dashboard</a>
        </div>
    </nav>
    <div class="container">
        <div class="row g-4">
            <div class="col-lg-4">
                <div class="admin-card">
                    <div class="card-header-custom"><i class="bi bi-person-plus-fill me-2"></i> {{ customer.id ? 'Edit' : 'Add' }} Customer</div>
                    <div class="p-4">
                        <form ng-submit="saveCustomer()">
                            <div class="mb-3">
                                <label class="small fw-bold text-muted">FULL NAME</label>
                                <input type="text" class="form-control" ng-model="customer.name" required>
                            </div>
                            <div class="mb-3">
                                <label class="small fw-bold text-muted">EMAIL</label>
                                <input type="email" class="form-control" ng-model="customer.email" required>
                            </div>
                            <div class="mb-3">
                                <label class="small fw-bold text-muted">PHONE</label>
                                <input type="text" class="form-control" ng-model="customer.phone" required>
                            </div>
                            <div class="mb-4">
                                <label class="small fw-bold text-muted">ADDRESS</label>
                                <input type="text" class="form-control" ng-model="customer.address" required>
                            </div>
                            <button type="submit" class="btn-submit shadow-sm">{{ customer.id ? 'Update' : 'Register Customer' }}</button>
                        </form>
                    </div>
                </div>
            </div>
            <div class="col-lg-8">
                <div class="admin-card">
                    <div class="p-4 border-bottom"><h5 class="fw-bold m-0 text-success">Registered Customers</h5></div>
                    <div class="table-responsive">
                        <table class="table custom-table mb-0">
                            <thead><tr><th>Name</th><th>Contact Info</th><th>Address</th><th class="text-end">Actions</th></tr></thead>
                            <tbody>
                                <tr ng-repeat="c in customers">
                                    <td class="fw-bold text-dark">{{c.name}}</td>
                                    <td><div class="text-dark small">{{c.email}}</div><div class="text-muted small">{{c.phone}}</div></td>
                                    <td class="text-muted small">{{c.address}}</td>
                                    <td class="text-end">
                                        <button class="action-btn btn-edit" ng-click="editCustomer(c)"><i class="bi bi-pencil-fill"></i></button>
                                        <button class="action-btn btn-delete" ng-click="deleteCustomer(c.id)"><i class="bi bi-trash-fill"></i></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
```

---

## File: frontend/product_sell.html
```html
# Path: frontend/product_sell.html
<!DOCTYPE html>
<html lang="en" ng-app="userApp">
<head>
    <meta charset="UTF-8">
    <title>Post Sale - Agrivendia</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link href="css/styles.css" rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
    <script src="app.js"></script>
</head>
<body ng-controller="ProductSellCtrl" class="bg-light">
    
    <div ng-include="'components/admin_navbar.html'"></div>

    <div class="container">
        <div class="form-card mx-auto p-4" style="max-width:600px;">
            <h3 class="fw-bold text-center mb-4 text-success">Sell Produce</h3>
            <form ng-submit="saveProductSell()">
                <div class="row g-3 mb-3">
                    <div class="col-6">
                        <label class="small fw-bold text-muted">Category</label>
                        <select class="form-select" ng-model="product_sell.category" ng-change="loadProducts()" required>
                            <option ng-repeat="c in categories" value="{{c.id}}">{{c.name}}</option>
                        </select>
                    </div>
                    <div class="col-6">
                        <label class="small fw-bold text-muted">Product</label>
                        <select class="form-select" ng-model="product_sell.product" required ng-disabled="!product_sell.category">
                            <option ng-repeat="p in productsList" value="{{p.id}}">{{p.productName}}</option>
                        </select>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="small fw-bold text-muted">Title / Variety</label>
                    <input type="text" class="form-control" ng-model="product_sell.name" placeholder="e.g. Nashik Red">
                </div>
                <div class="mb-3">
                    <label class="small fw-bold text-muted">Photo</label>
                    <input type="file" class="form-control" fileread="product_sell.image" accept="image/*">
                </div>
                <div class="row g-3 mb-3">
                    <div class="col-6"><label class="small fw-bold text-muted">Price (₹)</label><input type="number" class="form-control" ng-model="product_sell.price" required></div>
                    <div class="col-6"><label class="small fw-bold text-muted">Qty</label><input type="number" class="form-control" ng-model="product_sell.quantity" required></div>
                </div>
                <div class="mb-3"><label class="small fw-bold text-muted">Location</label><input type="text" class="form-control" ng-model="product_sell.location" required></div>
                <div class="mb-4"><label class="small fw-bold text-muted">Description</label><textarea class="form-control" rows="3" ng-model="product_sell.description"></textarea></div>
                
                <button type="submit" class="btn-success-custom w-100 rounded-pill" ng-disabled="isSubmitting">
                    {{ isSubmitting ? 'Publishing...' : 'Post Listing' }}
                </button>
            </form>
        </div>
    </div>
</body>
</html>
```

---

## File: frontend/css/styles.css
```css
# Path: frontend/css/styles.css
/* GLOBAL SETTINGS */
body { font-family: 'Poppins', sans-serif; background-color: #f8f9fa; }
a { text-decoration: none; }

/* NAVBAR */
.navbar { background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.05); padding: 15px 0; }
.navbar-brand { font-weight: 700; color: #2E7D32 !important; font-size: 1.5rem; }
.nav-link { font-weight: 600; color: #333; margin: 0 10px; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.5px; }
.nav-link:hover, .nav-link.active-link { color: #2E7D32 !important; }

/* NAVBAR BUTTONS */
.btn-login-nav { border: 2px solid #2E7D32; color: #2E7D32; border-radius: 50px; padding: 5px 22px; font-weight: 700; transition: 0.3s; }
.btn-login-nav:hover { background: #2E7D32; color: white; }
.btn-signup-nav { background: #2E7D32; color: white; border-radius: 50px; padding: 7px 22px; font-weight: 700; margin-left: 10px; transition: 0.3s; border: 2px solid #2E7D32; }
.btn-signup-nav:hover { background: #1B5E20; border-color: #1B5E20; }

/* DROPDOWN */
.dropdown:hover .dropdown-menu { display: block; margin-top: 0; animation: fadeIn 0.3s; }
.dropdown-menu { border: none; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border-radius: 0 0 12px 12px; padding: 10px 0; min-width: 220px; }
.dropdown-item { padding: 10px 20px; font-size: 0.9rem; transition: 0.2s; }
.dropdown-item:hover { background: #f1f8e9; color: #2E7D32; padding-left: 25px; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

/* FOOTER */
footer { background: #212529; color: white; text-align: center; padding: 3rem 0; margin-top: 3rem; }

/* COMMON BUTTONS */
.btn-success-custom { background: #2E7D32; color: white; border: none; padding: 12px; border-radius: 8px; font-weight: 600; transition: 0.3s; }
.btn-success-custom:hover { background: #1B5E20; color: white; }

/* CARDS */
.feature-box, .category-card, .plan-card, .reg-card, .login-box, .form-card, .admin-card {
    background: white; border-radius: 15px; box-shadow: 0 5px 20px rgba(0,0,0,0.05); transition: 0.3s; border: 1px solid #eee; overflow: hidden;
}
.feature-box:hover, .category-card:hover, .plan-card:hover { transform: translateY(-5px); border-color: #2E7D32; }

/* INDEX: HERO & SEARCH */
.carousel-item { height: 400px; background-color: #333; }
.carousel-item img { object-fit: cover; height: 100%; opacity: 0.7; }
.carousel-caption h1 { font-weight: 800; font-size: 3.5rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.8); }
.search-overlap { margin-top: -40px; position: relative; z-index: 10; padding: 0 15px; }
.search-box { background: white; padding: 15px; border-radius: 50px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); max-width: 700px; margin: 0 auto; display: flex; }
.search-input { border: none; flex-grow: 1; padding: 10px 20px; border-radius: 50px; outline: none; }
.search-btn { background: #2E7D32; color: white; border: none; padding: 10px 40px; border-radius: 50px; font-weight: 600; transition: 0.3s; }
.search-btn:hover { background: #1B5E20; }

/* INDEX: PRODUCT CARD */
.product-card { background: white; border: none; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); transition: all 0.3s ease; height: 100%; cursor: pointer; overflow: hidden; }
.product-card:hover { transform: translateY(-10px); box-shadow: 0 15px 30px rgba(0,0,0,0.1); }
.prod-img { height: 180px; background: #f1f8e9; display: flex; align-items: center; justify-content: center; color: #2E7D32; font-size: 4rem; position: relative; }
.prod-badge { position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.9); padding: 5px 10px; border-radius: 10px; font-size: 0.75rem; font-weight: 700; color: #2E7D32; }
.prod-details { padding: 20px; }
.prod-title { font-weight: 700; font-size: 1.1rem; color: #333; margin-bottom: 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.prod-price { color: #2E7D32; font-weight: 800; font-size: 1.4rem; }
.btn-card-view { width: 100%; background: #e8f5e9; color: #2E7D32; border: none; padding: 10px; border-radius: 8px; font-weight: 600; margin-top: 10px; transition: 0.3s; }
.product-card:hover .btn-card-view { background: #2E7D32; color: white; }

/* MARKET: ECOM CARD */
.ecom-card { background: white; border: 1px solid #f0f0f0; border-radius: 12px; overflow: hidden; transition: 0.2s; height: 100%; position: relative; cursor: pointer; display: flex; flex-direction: column; }
.ecom-card:hover { transform: translateY(-5px); box-shadow: 0 8px 20px rgba(0,0,0,0.08); border-color: #2E7D32; }
.card-img-wrap { height: 200px; width: 100%; background: #f9f9f9; overflow: hidden; position: relative; border-bottom: 1px solid #f0f0f0; }
.card-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: 0.4s ease; }
.ecom-card:hover .card-img-wrap img { transform: scale(1.05); }
.badge-custom { position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.95); padding: 5px 12px; border-radius: 50px; font-size: 0.75rem; font-weight: 700; color: #2E7D32; box-shadow: 0 2px 5px rgba(0,0,0,0.1); z-index: 2; }
.badge-buy { background: #1565c0; color: white; left: 10px; right: auto; }
.price-tag { font-weight: 800; font-size: 1.25rem; }
.text-price-sell { color: #2E7D32; }
.text-price-buy { color: #1565c0; }

/* DASHBOARD: SIDEBAR & HEADER */
.dash-header { background: #2E7D32; padding: 40px 0 80px; color: white; margin-bottom: 50px; }
.stats-box { background: white; border-radius: 12px; padding: 25px; box-shadow: 0 5px 20px rgba(0,0,0,0.05); margin-top: -60px; text-align: center; border: 1px solid #eee; transition: 0.3s; }
.stats-box:hover { transform: translateY(-5px); border-color: #2E7D32; }
.sidebar { width: 260px; background: #263238; color: white; display: flex; flex-direction: column; flex-shrink: 0; height: 100vh; }
.sidebar-header { padding: 25px; font-weight: 700; border-bottom: 1px solid #37474F; color: #4CAF50; font-size: 1.2rem; }
.sidebar .nav-link { color: #cfd8dc; padding: 15px 25px; display: block; transition: 0.2s; cursor: pointer; font-size: 0.95rem; }
.sidebar .nav-link:hover { background: #37474F; color: white; padding-left: 30px; }
.sidebar .nav-link.active { background: #2E7D32; color: white; border-left: 5px solid #81C784; }

/* FORMS & AUTH */
.form-control { background: #f9f9f9; border: 1px solid #eee; padding: 12px; border-radius: 8px; }
.form-control:focus { background: white; border-color: #2E7D32; box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1); }
.auth-wrapper { flex: 1; display: flex; align-items: center; justify-content: center; height: 80vh; }
.login-box { width: 450px; padding: 40px; }
.reg-card { width: 500px; padding: 40px; }

/* TABLES (Admin) */
.custom-table thead th { background: #f1f8e9; color: #2E7D32; border: none; padding: 15px; font-weight: 600; }
.custom-table tbody td { padding: 15px; border-bottom: 1px solid #eee; vertical-align: middle; }
.action-btn { width: 35px; height: 35px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; border: none; transition: 0.2s; margin-left: 5px; }
.btn-edit { background: #e3f2fd; color: #1976d2; }
.btn-delete { background: #ffebee; color: #d32f2f; }
```

---

## File: frontend/components/footer.html
```html
# Path: frontend/components/footer.html
<footer>
    <div class="container">
        <h4 class="fw-bold text-success mb-3">Agrivendia</h4>
        <div class="mb-4">
            <a href="#" class="text-white mx-2"><i class="bi bi-facebook"></i></a>
            <a href="#" class="text-white mx-2"><i class="bi bi-twitter"></i></a>
            <a href="#" class="text-white mx-2"><i class="bi bi-instagram"></i></a>
        </div>
        <p class="small opacity-50 mb-0">&copy; 2024 Agrivendia Marketplace. All Rights Reserved.</p>
    </div>
</footer>
```

---

## File: frontend/components/navbar.html
```html
# Path: frontend/components/navbar.html
<nav class="navbar navbar-expand-lg sticky-top">
    <div class="container">
        <a class="navbar-brand" href="index.html"><i class="bi bi-flower1"></i> Agrivendia</a>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav mx-auto">
                <li class="nav-item"><a class="nav-link" ng-class="{'active-link': activePage=='home'}" href="index.html">Home</a></li>
                <li class="nav-item"><a class="nav-link" ng-class="{'active-link': activePage=='category'}" href="category.html">Categories</a></li>
                <li class="nav-item"><a class="nav-link" ng-class="{'active-link': activePage=='market'}" href="market.html">Market</a></li>
                <li class="nav-item"><a class="nav-link" ng-class="{'active-link': activePage=='plan'}" href="plan.html">Plans</a></li>
                <li class="nav-item"><a class="nav-link" ng-class="{'active-link': activePage=='about'}" href="about.html">About Us</a></li>
            </ul>

            <div class="d-flex align-items-center">
                <!-- Logged In -->
                <div ng-if="currentUser" class="dropdown">
                    <a class="nav-link dropdown-toggle text-success fw-bold p-0" href="#" data-bs-toggle="dropdown">
                        <i class="bi bi-person-circle"></i> Hi, {{currentUser.name}}
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                        <li><a class="dropdown-item" href="customer_dashboard.html"><i class="bi bi-speedometer2 me-2"></i> My Dashboard</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item" href="#" ng-click="logout()"><i class="bi bi-box-arrow-right me-2"></i> Logout</a></li>
                    </ul>
                </div>
                <!-- Logged Out -->
                <div ng-if="!currentUser" class="d-flex">
                    <a href="login.html" class="btn-login-nav">Login</a>
                    <a href="register.html" class="btn-signup-nav">Sign Up</a>
                </div>
            </div>
        </div>
    </div>
</nav>
```

---

## File: frontend/components/admin_navbar.html
```html
# Path: frontend/components/admin_navbar.html
<!-- Simplified Header for Forms -->
<nav class="navbar mb-4 border-bottom">
    <div class="container">
        <a class="navbar-brand fw-bold text-success" href="index.html">Agrivendia <span class="badge bg-success rounded-pill small ms-2" style="font-size:0.7rem;">Portal</span></a>
        <a href="javascript:history.back()" class="btn btn-sm btn-outline-secondary rounded-pill px-3"><i class="bi bi-arrow-left"></i> Back</a>
    </div>
</nav>
```

---

## File: backend/populate_data.py
```python
# Path: backend/populate_data.py
# Path: backend/populate_data.py
import os
import django
import random
from datetime import datetime

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agrivendia.settings')
django.setup()

from category.models import Category
from product.models import Product
from product_sell.models import ProductSell
from product_buy.models import ProductBuy
from product_bid.models import ProductBid
from customer.models import Customer
from user.models import User
from plan.models import Plan

def populate():
    print("🧹 Cleaning old data...")
    # Delete in specific order to satisfy Foreign Keys
    ProductBid.objects.all().delete()
    ProductSell.objects.all().delete()
    ProductBuy.objects.all().delete()
    Product.objects.all().delete()
    Category.objects.all().delete()
    Customer.objects.all().delete()
    User.objects.all().delete()
    Plan.objects.all().delete()
    
    print("🌱 Populating Database...")

    # --- 1. CATEGORIES (6 Records) ---
    print("   [1/9] Creating Categories...")
    cats_data = {
        "Vegetables": "Fresh, organic, and locally grown vegetables.",
        "Fruits": "Premium quality sweet fruits.",
        "Grains": "Rice, Wheat, Maize, and Millets.",
        "Spices": "Authentic aromatic spices.",
        "Commercial": "Cotton, Sugarcane, Jute, and Coffee.",
        "Dairy": "Fresh Milk, Ghee, Paneer, and Curd."
    }
    
    cat_objects = {}
    for name, desc in cats_data.items():
        c = Category.objects.create(name=name, description=desc)
        cat_objects[name] = c

    # --- 2. PLANS (4 Records) ---
    print("   [2/9] Creating Plans...")
    plans_data = [
        ("Free Starter", "Lifetime", "0"),
        ("Grower Basic", "1 Month", "199"),
        ("Trader Pro", "6 Months", "999"),
        ("Enterprise", "1 Year", "4999"),
    ]
    for name, dur, price in plans_data:
        Plan.objects.create(name=name, duration=dur, price=price)

    # --- 3. ADMIN USERS (3 Records) ---
    print("   [3/9] Creating Admins...")
    User.objects.create(name="Super Admin", email="admin@agri.com", phone="9999999999", password="admin")
    User.objects.create(name="Support Staff", email="support@agri.com", phone="8888888888", password="admin")
    User.objects.create(name="Manager", email="manager@agri.com", phone="7777777777", password="admin")

    # --- 4. CUSTOMERS (20 Records) ---
    print("   [4/9] Creating Customers...")
    customer_names = [
        "Ramesh Patil", "Suresh Kumar", "Anita Desai", "Farm Fresh Ltd", "Organic Basket",
        "John Doe", "Rahul Dravid", "Big Basket Sourcing", "Reliance Fresh", "Kisan Mandi",
        "Vijay Singh", "Priya Sharma", "Green Earth Agro", "Mahesh Babu", "Local Traders",
        "Sunita Williams", "Harvest Gold", "Pure Foods", "Desi Farms", "Nature Basket"
    ]
    
    customers = []
    for i, name in enumerate(customer_names):
        c = Customer.objects.create(
            name=name,
            email=f"user{i+1}@example.com",
            phone=f"98{random.randint(10000000, 99999999)}",
            address=f"Plot No {i+1}, Agri Zone, India",
            password="123" # Simple password for testing
        )
        customers.append(c)

    # --- 5. PRODUCTS (20 Records) ---
    print("   [5/9] Creating Master Products...")
    # (Name, Category, Image)
    product_catalog = [
        ("Red Onion", "Vegetables", "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600"),
        ("Potato (Jyoti)", "Vegetables", "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600"),
        ("Tomato (Hybrid)", "Vegetables", "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600"),
        ("Green Chilli", "Vegetables", "https://images.unsplash.com/photo-1628003632975-6f2963162788?w=600"),
        ("Carrot", "Vegetables", "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600"),
        ("Spinach", "Vegetables", "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600"),
        ("Cauliflower", "Vegetables", "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=600"),
        
        ("Kashmir Apple", "Fruits", "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600"),
        ("Alphonso Mango", "Fruits", "https://images.unsplash.com/photo-1553279768-865429fa0078?w=600"),
        ("Robusta Banana", "Fruits", "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=600"),
        ("Pomegranate", "Fruits", "https://images.unsplash.com/photo-1615485925763-867862780c1d?w=600"),
        ("Green Grapes", "Fruits", "https://images.unsplash.com/photo-1537640538965-175629952716?w=600"),

        ("Basmati Rice", "Grains", "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600"),
        ("Wheat (Sharbati)", "Grains", "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600"),
        ("Yellow Corn", "Grains", "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600"),
        
        ("Turmeric Powder", "Spices", "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600"),
        ("Red Chilli Powder", "Spices", "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600"),
        
        ("Raw Cotton", "Commercial", "https://images.unsplash.com/photo-1606132039201-98782a20b227?w=600"),
        ("Sugarcane", "Commercial", "https://images.unsplash.com/photo-1605333190460-70f90c4fb50f?w=600"),
        
        ("Buffalo Milk", "Dairy", "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600"),
    ]

    products_list = []
    for name, cat_key, img in product_catalog:
        p = Product.objects.create(
            productName=name,
            category=cat_objects[cat_key],
            productDescription=f"Standard quality {name}",
            productImage=img
        )
        products_list.append(p)

    # Locations for randomization
    locations = ["Nashik", "Pune", "Mumbai", "Nagpur", "Kolar", "Punjab", "Haryana", "Bangalore", "Delhi", "Gujarat"]

    # --- 6. SELL LISTINGS (20 Records) ---
    print("   [6/9] Creating Sell Listings...")
    sell_posts = []
    for i in range(20):
        cust = random.choice(customers)
        prod = random.choice(products_list)
        loc = random.choice(locations)
        
        sp = ProductSell.objects.create(
            customer=cust,
            product=prod,
            category=prod.category,
            name=f"{prod.productName} - Lot {i+1}",
            location=loc,
            price=round(random.uniform(20.0, 5000.0), 2),
            quantity=random.randint(50, 5000),
            description="Freshly harvested, immediate delivery available.",
            sellerName=cust.name,
            phoneNo=cust.phone,
            # We skip actual file upload for script, frontend falls back to Product Image
            image=None 
        )
        sell_posts.append(sp)

    # --- 7. BUY REQUESTS (20 Records) ---
    print("   [7/9] Creating Buy Requests...")
    buy_posts = []
    for i in range(20):
        cust = random.choice(customers)
        prod = random.choice(products_list)
        loc = random.choice(locations)
        
        bp = ProductBuy.objects.create(
            customer=cust,
            product=prod,
            category=prod.category,
            name="General",
            buyerName=cust.name,
            price=round(random.uniform(15.0, 4000.0), 2), # Usually slightly lower than sell price
            quantity=random.randint(100, 10000),
            location=loc,
            image=None
        )
        buy_posts.append(bp)

    # --- 8. BIDS (20 Records) ---
    print("   [8/9] Creating Bids...")
    for i in range(20):
        # 50% chance to bid on Sell Post, 50% on Buy Post
        is_sell_bid = random.choice([True, False])
        bidder = random.choice(customers)
        
        status_choice = random.choice(['PENDING', 'ACCEPTED', 'PENDING', 'REJECTED'])
        
        if is_sell_bid:
            post = random.choice(sell_posts)
            # Ensure bidder is not seller (simple check)
            while post.customer == bidder:
                bidder = random.choice(customers)
            
            ProductBid.objects.create(
                bidder=bidder,
                sell_post=post,
                amount=post.price * 0.95, # Bid slightly lower
                quantity=random.randint(10, post.quantity),
                message="Can you arrange transport?",
                status=status_choice
            )
        else:
            post = random.choice(buy_posts)
            while post.customer == bidder:
                bidder = random.choice(customers)
                
            ProductBid.objects.create(
                bidder=bidder,
                buy_post=post,
                amount=post.price * 1.05, # Offer slightly higher
                quantity=post.quantity,
                message="I have this stock ready.",
                status=status_choice
            )

    print("\n✅ Database Successfully Populated with 20+ records per table!")
    print(f"   -> {Category.objects.count()} Categories")
    print(f"   -> {Product.objects.count()} Master Products")
    print(f"   -> {Customer.objects.count()} Customers")
    print(f"   -> {ProductSell.objects.count()} Sell Listings")
    print(f"   -> {ProductBuy.objects.count()} Buy Requests")
    print(f"   -> {ProductBid.objects.count()} Bids")

if __name__ == '__main__':
    populate()
```

---

## File: backend/product/serializer.py
```python
# Path: backend/product/serializer.py
from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
  



    class Meta:
        model = Product
        fields = '__all__'
        read_only_fields = ['created_at']
```

---

## File: backend/product/admin.py
```python
# Path: backend/product/admin.py
from django.contrib import admin

# Register your models here.

```

---

## File: backend/product/urls.py
```python
# Path: backend/product/urls.py
from django.urls import path
from . import views
from .views import ProductAPI
urlpatterns = [
    path("",views.ProductAPI.as_view()),
    path("<int:id>/",ProductAPI.as_view())
]
```

---

## File: backend/product/__init__.py
```python
# Path: backend/product/__init__.py

```

---

## File: backend/product/apps.py
```python
# Path: backend/product/apps.py
from django.apps import AppConfig


class ProductConfig(AppConfig):
    name = "product"

```

---

## File: backend/product/views.py
```python
# Path: backend/product/views.py
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Product
from .serializer import ProductSerializer

# Create your views here.
class ProductAPI(APIView):
    def post(self,request):
        serializer=ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, id=None):
        if id:
            try:
                product = Product.objects.get(id=id)
            except Product.DoesNotExist:
                return Response({"error":"Not Found"}, status=status.HTTP_404_NOT_FOUND)
            serializer = ProductSerializer(product)
            return Response(serializer.data)
        
        # --- FIX STARTS HERE ---
        products = Product.objects.all()
        
        # Apply Category Filter
        category_id = request.query_params.get('category_id')
        if category_id:
            products = products.filter(category_id=category_id)
            
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
    
    def put(self,request,id):
        try:
            product= Product.objects.get(id=id)
        except Product.DoesNotExist:
            return Response({"error":"Not Found"},status=status.HTTP_404_NOT_FOUND)
            
        serializer = ProductSerializer(product, data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.error, status = status.HTTP_400_BAD_REQUEST)
    def delete(self,request,id):
        try:
            product= Product.objects.get(id=id)
        except Product.DoesNotExist:
            return Response({"error":"Not Found"},status=status.HTTP_404_NOT_FOUND)
        product.delete()
        return Response({"messsage":"Deleted"},status=status.HTTP_204_NO_CONTENT)




    
        
    



```

---

## File: backend/product/models.py
```python
# Path: backend/product/models.py
# Path: backend/product/models.py
from django.db import models
from category.models import Category

class Product(models.Model):
    productName = models.CharField(max_length=100)
    productDescription = models.CharField(max_length=1000)
    
    # Linked directly to Category
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products', null=True)
    
    # Image stored here so it appears automatically for all sellers/buyers of this product
    productImage = models.CharField(max_length=500, blank=True, null=True)

    def __str__(self):
        return self.productName
```

---

## File: backend/product/tests.py
```python
# Path: backend/product/tests.py
from django.test import TestCase

# Create your tests here.

```

---

## File: backend/agrivendia/asgi.py
```python
# Path: backend/agrivendia/asgi.py
"""
ASGI config for agrivendia project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "agrivendia.settings")

application = get_asgi_application()

```

---

## File: backend/agrivendia/settings.py
```python
# Path: backend/agrivendia/settings.py
"""
Django settings for agrivendia project.

Generated by 'django-admin startproject' using Django 6.0.1.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/6.0/ref/settings/
"""

from pathlib import Path
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/6.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "django-insecure-u(w&g0_8^z-i&w6zc-&@a_7@@)e$kp_fi2r0=2wc#37+fq$1fx"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    "corsheaders",
    "category",
    "customer",
    "plan",
    "user",
    "product",
    "product_buy",
    "product_sell",
    "product_bid",
    "rest_framework",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "agrivendia.urls"

STATIC_URL = '/static/'

# Add this if you don't already have it



TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "agrivendia.wsgi.application"


# Database
# https://docs.djangoproject.com/en/6.0/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}


# Password validation
# https://docs.djangoproject.com/en/6.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/6.0/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/6.0/howto/static-files/


CORS_ALLOW_ALL_ORIGINS =True

MEDIA_URL = '/Media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'Media')
```

---

## File: backend/agrivendia/urls.py
```python
# Path: backend/agrivendia/urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    path("category/", include('category.urls')),
    path("customer/", include('customer.urls')),
    path("user/", include('user.urls')),
    path("plan/", include('plan.urls')),
    path("product/", include('product.urls')),
    path("product_buy/", include('product_buy.urls')),
    path("product_sell/", include('product_sell.urls')),
    path("product_bid/", include('product_bid.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

---

## File: backend/agrivendia/__init__.py
```python
# Path: backend/agrivendia/__init__.py

```

---

## File: backend/agrivendia/wsgi.py
```python
# Path: backend/agrivendia/wsgi.py
"""
WSGI config for agrivendia project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "agrivendia.settings")

application = get_wsgi_application()

```

---

## File: backend/customer/serializer.py
```python
# Path: backend/customer/serializer.py
from rest_framework import serializers
from .models import Customer

class CustomerSerializer(serializers.ModelSerializer):
    '''name = serializers.CharField(max_length = 100)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length = 10)
    address = serializers.CharField()
    password = serializers.CharField(max_length=100)
    created_at = serializers.DateTimeField(auto_now = True)'''



    class Meta:
        model = Customer
        fields = '__all__'
        read_only_fields = ['created_at']
```

---

## File: backend/customer/admin.py
```python
# Path: backend/customer/admin.py
from django.contrib import admin

# Register your models here.

```

---

## File: backend/customer/urls.py
```python
# Path: backend/customer/urls.py
from django.urls import path
from .views import CustomerAPI, SendTelegramOTP, VerifyTelegramOTP, LoginAPI, ResetPasswordAPI

urlpatterns = [
    path('', CustomerAPI.as_view()),                 # List & Create
    path('<int:id>/', CustomerAPI.as_view()),        # Get/Update/Delete by ID
    path('login/', LoginAPI.as_view()), 
    path('send-otp/', SendTelegramOTP.as_view()), 
    path('verify-otp/', VerifyTelegramOTP.as_view()),
    path('reset-password/', ResetPasswordAPI.as_view()),
]
```

---

## File: backend/customer/__init__.py
```python
# Path: backend/customer/__init__.py

```

---

## File: backend/customer/apps.py
```python
# Path: backend/customer/apps.py
from django.apps import AppConfig


class CustomerConfig(AppConfig):
    name = "customer"

```

---

## File: backend/customer/views.py
```python
# Path: backend/customer/views.py
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Customer
from .serializer import CustomerSerializer
import random
import requests
import os

# Temporary storage for OTPs (In memory)
OTP_STORAGE = {} 
TELEGRAM_BOT_TOKEN =  os.environ.get("TLGRMTKN")
if not TELEGRAM_BOT_TOKEN:
    print("⚠️ WARNING: Telegram Token not found in environment variables.")

# 1. LOGIN API
class LoginAPI(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        try:
            # Check if user exists
            customer = Customer.objects.get(email=email)
            # Check password
            if customer.password == password:
                serializer = CustomerSerializer(customer)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Incorrect Password"}, status=status.HTTP_400_BAD_REQUEST)
        except Customer.DoesNotExist:
            return Response({"error": "Email not found. Please Register."}, status=status.HTTP_404_NOT_FOUND)

# 2. SEND OTP
class SendTelegramOTP(APIView):
    def post(self, request):
        if not TELEGRAM_BOT_TOKEN:
            return Response({"error": "Server configuration error: Telegram Token missing"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        phone = request.data.get('phone')
        chat_id = request.data.get('chat_id') 
        
        try:
            customer = Customer.objects.get(phone=phone)
        except Customer.DoesNotExist:
            return Response({"error": "Phone number not registered."}, status=status.HTTP_404_NOT_FOUND)

        if not chat_id:
             return Response({"error": "Chat ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Generate OTP
        otp = str(random.randint(1000, 9999))
        OTP_STORAGE[phone] = otp
        
        # Send to Telegram
        message = f"🔐 Agrivendia OTP: {otp}\nUser: {customer.name}"
        telegram_url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
        data = {
            "chat_id": chat_id, 
            "text": message
        }
        
        try:
            requests.post(telegram_url, data=data)
            return Response({"message": "OTP sent to your Telegram!"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "Telegram API Error: " + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# 3. VERIFY OTP (Does NOT delete OTP yet, just checks it)
class VerifyTelegramOTP(APIView):
    def post(self, request):
        phone = request.data.get('phone')
        otp_entered = request.data.get('otp')

        if phone in OTP_STORAGE and str(OTP_STORAGE[phone]) == str(otp_entered):
            # Return success but keep OTP in memory for the next step (Reset Password)
            return Response({"message": "OTP Verified"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

# 4. RESET PASSWORD (New API)
class ResetPasswordAPI(APIView):
    def post(self, request):
        phone = request.data.get('phone')
        otp_entered = request.data.get('otp')
        new_password = request.data.get('new_password')

        # Security Check: Verify OTP again
        if phone in OTP_STORAGE and str(OTP_STORAGE[phone]) == str(otp_entered):
            try:
                customer = Customer.objects.get(phone=phone)
                customer.password = new_password # Set New Password
                customer.save()
                
                del OTP_STORAGE[phone] # NOW delete the OTP
                return Response({"message": "Password changed successfully!"}, status=status.HTTP_200_OK)
            except Customer.DoesNotExist:
                return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"error": "Session expired or Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

# Standard CRUD
class CustomerAPI(APIView):
    def post(self, request):
        serializer = CustomerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, id=None):
        if id:
            try:
                customer = Customer.objects.get(id=id)
            except Customer.DoesNotExist:
                return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)
            serializer = CustomerSerializer(customer)
            return Response(serializer.data)
        customers = Customer.objects.all()
        serializer = CustomerSerializer(customers, many=True)
        return Response(serializer.data)

    def put(self, request, id):
        try:
            customer = Customer.objects.get(id=id)
        except Customer.DoesNotExist:
            return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = CustomerSerializer(customer, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        try:
            customer = Customer.objects.get(id=id)
        except Customer.DoesNotExist:
            return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)
        customer.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
```

---

## File: backend/customer/models.py
```python
# Path: backend/customer/models.py
from django.db import models

# Create your models here.
class Customer(models.Model):
    name = models.CharField(max_length = 100)
    email = models.EmailField(unique = True)
    phone = models.CharField(max_length = 10)
    address = models.TextField(blank = True)
    password = models.CharField(max_length=100,default='None')
    created_at = models.DateTimeField(auto_now_add= True)

    def __str__(self):
        return self.name

```

---

## File: backend/customer/tests.py
```python
# Path: backend/customer/tests.py
from django.test import TestCase

# Create your tests here.

```

---

## File: backend/category/serializer.py
```python
# Path: backend/category/serializer.py
from rest_framework import serializers
from .models import Category

class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = '__all__'
        #read_only_fields = ['created_at']
```

---

## File: backend/category/admin.py
```python
# Path: backend/category/admin.py
from django.contrib import admin

# Register your models here.

```

---

## File: backend/category/urls.py
```python
# Path: backend/category/urls.py
from django.urls import path
from . import views
from .views import CategoryAPI
urlpatterns = [
    path("",views.CategoryAPI.as_view()),
    path("<int:id>/",CategoryAPI.as_view())
]

```

---

## File: backend/category/__init__.py
```python
# Path: backend/category/__init__.py

```

---

## File: backend/category/apps.py
```python
# Path: backend/category/apps.py
from django.apps import AppConfig


class CategoryConfig(AppConfig):
    name = "category"

```

---

## File: backend/category/views.py
```python
# Path: backend/category/views.py
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Category
from .serializer import CategorySerializer


# Create your views here.
class CategoryAPI(APIView):
    def post(self,request):
        serializer=CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

    def get(self,request,id=None):
        if id:
            try:
                category= Category.objects.get(id=id)
            except Category.DoesNotExist:
                return Response({"error":"Not Found"},status=status.HTTP_404_NOT_FOUND)
            serializer = CategorySerializer(category)
            return Response(serializer.data)
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many = True)
        return Response(serializer.data)


    
    def put(self,request,id):
        try:
            category= Category.objects.get(id=id)
        except Category.DoesNotExist:
            return Response({"error":"Not Found"},status=status.HTTP_404_NOT_FOUND)
            
        serializer = CategorySerializer(category, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self,request,id):
        try:
            category= Category.objects.get(id=id)
        except Category.DoesNotExist:
            return Response({"error":"Not Found"},status=status.HTTP_404_NOT_FOUND)
        category.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)










```

---

## File: backend/category/models.py
```python
# Path: backend/category/models.py
from django.db import models
# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length = 50)
    description = models.CharField(max_length = 1000)
    image_url = models.CharField(max_length=500, blank=True, null=True) 
    #image= models.ImageField(upload_to="categories/",blank=True,null=True)
    #variety = models.CharField(max_length= 10)
    created_at = models.DateTimeField(auto_now_add= True)
    updated_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        
        return self.name


```

---

## File: backend/category/tests.py
```python
# Path: backend/category/tests.py
from django.test import TestCase

# Create your tests here.

```

---

## File: backend/user/serializer.py
```python
# Path: backend/user/serializer.py
from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length = 100)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length = 10)
    password = serializers.CharField(max_length=100, default='admin123') 


    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True} 
        }
```

---

## File: backend/user/admin.py
```python
# Path: backend/user/admin.py
from django.contrib import admin

# Register your models here.

```

---

## File: backend/user/urls.py
```python
# Path: backend/user/urls.py
from django.urls import path
from .views import UserAPI, UserLoginAPI, SendUserOTP, VerifyUserOTP, ResetUserPassword,BulkUploadAPI

urlpatterns = [
    path("", UserAPI.as_view()),
    path("<int:id>/", UserAPI.as_view()),
    path("login/", UserLoginAPI.as_view()),
    path("send-otp/", SendUserOTP.as_view()),
    path("verify-otp/", VerifyUserOTP.as_view()),
    path("reset-password/", ResetUserPassword.as_view()),
    path("bulk-upload/<str:model_name>/", BulkUploadAPI.as_view()),
]
```

---

## File: backend/user/__init__.py
```python
# Path: backend/user/__init__.py

```

---

## File: backend/user/apps.py
```python
# Path: backend/user/apps.py
from django.apps import AppConfig


class UserConfig(AppConfig):
    name = "user"

```

---

## File: backend/user/views.py
```python
# Path: backend/user/views.py
import csv
import io
from django.apps import apps
from category.models import Category
from customer.models import Customer
from user.models import User
from product.models import Product
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User
from .serializer import UserSerializer
import os
import random
import requests

# Storage for User (Admin) OTPs
USER_OTP_STORAGE = {} 
TELEGRAM_BOT_TOKEN =  os.environ.get("TLGRMTKN")

# --- 1. USER LOGIN ---
class UserLoginAPI(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        # Check User Table
        user = User.objects.filter(email=email).first()

        if user:
            if user.password == password:
                serializer = UserSerializer(user)
                data = serializer.data
                data['role'] = 'admin' # Mark as admin for frontend logic
                return Response(data, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Incorrect Password"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"error": "User email not found."}, status=status.HTTP_404_NOT_FOUND)

# --- 2. SEND OTP (For User/Admin) ---
class SendUserOTP(APIView):
    def post(self, request):
        phone = request.data.get('phone')
        chat_id = request.data.get('chat_id')
        
        user = User.objects.filter(phone=phone).first()
        if not user:
            return Response({"error": "User phone not registered."}, status=status.HTTP_404_NOT_FOUND)
        
        if not chat_id:
             return Response({"error": "Chat ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        otp = str(random.randint(1000, 9999))
        USER_OTP_STORAGE[phone] = otp
        
        message = f"🔐 Agrivendia ADMIN OTP: {otp}\nUser: {user.name}"
        telegram_url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
        data = {"chat_id": chat_id, "text": message}
        
        try:
            requests.post(telegram_url, data=data)
            return Response({"message": "OTP sent to Telegram"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# --- 3. VERIFY OTP ---
class VerifyUserOTP(APIView):
    def post(self, request):
        phone = request.data.get('phone')
        otp = request.data.get('otp')
        if phone in USER_OTP_STORAGE and str(USER_OTP_STORAGE[phone]) == str(otp):
            return Response({"message": "Verified"}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

# --- 4. RESET PASSWORD ---
class ResetUserPassword(APIView):
    def post(self, request):
        phone = request.data.get('phone')
        otp = request.data.get('otp')
        new_password = request.data.get('new_password')

        if phone in USER_OTP_STORAGE and str(USER_OTP_STORAGE[phone]) == str(otp):
            User.objects.filter(phone=phone).update(password=new_password)
            del USER_OTP_STORAGE[phone]
            return Response({"message": "User Password Updated"}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

# --- 5. CRUD API ---
class UserAPI(APIView):
    def get(self, request, id=None):
        if id:
            try:
                user = User.objects.get(id=id)
                serializer = UserSerializer(user)
                return Response(serializer.data)
            except User.DoesNotExist:
                return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)
        
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    def post(self, request):
        # Register new Admin/User
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, id):
        try:
            user = User.objects.get(id=id)
        except User.DoesNotExist:
            return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)
            
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        try:
            user = User.objects.get(id=id)
            user.delete()
            return Response({"message": "Deleted"}, status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)

# Path: backend/user/views.py

# ... imports ...

class BulkUploadAPI(APIView):
    def post(self, request, model_name):
        file = request.FILES.get('file')
        if not file:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        # Decode file
        decoded_file = file.read().decode('utf-8')
        io_string = io.StringIO(decoded_file)
        reader = csv.DictReader(io_string)
        
        success_count = 0
        errors = []
        
        # Map URL slug to actual Model Class
        model_mapping = {
            'category': apps.get_model('category', 'Category'),
            'product': apps.get_model('product', 'Product'),
            'product_sell': apps.get_model('product_sell', 'ProductSell'),
            'product_buy': apps.get_model('product_buy', 'ProductBuy'),
            'customer': apps.get_model('customer', 'Customer'),
            'plan': apps.get_model('plan', 'Plan')
        }

        ModelClass = model_mapping.get(model_name)
        if not ModelClass:
            return Response({"error": f"Invalid model name: {model_name}"}, status=status.HTTP_400_BAD_REQUEST)

        row_num = 1
        for row in reader:
            try:
                data = dict(row)
                
                # --- INTELLIGENT LOOKUPS ---

                # 1. PRODUCT UPLOAD: Convert Category Name -> Category Instance
                if model_name == 'product' and 'category' in data:
                    cat_name = data.pop('category')
                    cat_obj = Category.objects.filter(name__iexact=cat_name.strip()).first()
                    if not cat_obj:
                        raise Exception(f"Category '{cat_name}' not found. Upload Categories first.")
                    data['category'] = cat_obj 

                # 2. SELL/BUY POSTS: Convert Product Name -> Product Instance
                if model_name in ['product_sell', 'product_buy']:
                    if 'product' in data:
                        prod_name = data.pop('product')
                        prod_obj = Product.objects.filter(productName__iexact=prod_name.strip()).first()
                        if not prod_obj:
                            raise Exception(f"Product '{prod_name}' not found. Upload Products first.")
                        data['product'] = prod_obj
                        
                        # Also link Category automatically from the Product
                        data['category'] = prod_obj.category

                    # 3. HANDLE SELLER/BUYER EMAIL LOOKUP
                    # Use 'seller_email' in CSV for sells, 'buyer_email' for buys
                    email_key = 'seller_email' if model_name == 'product_sell' else 'buyer_email'
                    
                    if email_key in data:
                        email = data.pop(email_key)
                        cust_obj = Customer.objects.filter(email=email.strip()).first()
                        if not cust_obj:
                            raise Exception(f"Customer with email '{email}' not found.")
                        data['customer'] = cust_obj
                        
                        # Auto-fill display fields based on the found customer
                        if model_name == 'product_sell':
                            data['sellerName'] = cust_obj.name
                            data['phoneNo'] = cust_obj.phone
                        elif model_name == 'product_buy':
                            data['buyerName'] = cust_obj.name

                # 4. HANDLE RAW CATEGORY NAME IN SELL POSTS (If product lookup didn't catch it)
                if model_name == 'product_sell' and 'category' in data and not isinstance(data.get('category'), Category):
                    cat_name = data.pop('category')
                    cat_obj = Category.objects.filter(name__iexact=cat_name.strip()).first()
                    if cat_obj:
                        data['category'] = cat_obj

                # Create Record
                ModelClass.objects.create(**data)
                success_count += 1

            except Exception as e:
                errors.append(f"Row {row_num}: {str(e)}")
            
            row_num += 1

        return Response({
            "message": f"Uploaded {success_count} records successfully.",
            "errors": errors
        }, status=status.HTTP_200_OK)
    def post(self, request, model_name):
        file = request.FILES.get('file')
        if not file:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        decoded_file = file.read().decode('utf-8')
        io_string = io.StringIO(decoded_file)
        reader = csv.DictReader(io_string)
        
        success_count = 0
        errors = []
        
        # Map URL slug to actual Model Class
        model_mapping = {
            'category': apps.get_model('category', 'Category'),
            'product': apps.get_model('product', 'Product'),
            'product_sell': apps.get_model('product_sell', 'ProductSell'),
            'product_buy': apps.get_model('product_buy', 'ProductBuy'),
            'customer': apps.get_model('customer', 'Customer'),
            'plan': apps.get_model('plan', 'Plan')
        }

        ModelClass = model_mapping.get(model_name)
        if not ModelClass:
            return Response({"error": f"Invalid model name: {model_name}"}, status=status.HTTP_400_BAD_REQUEST)

        row_num = 1
        for row in reader:
            try:
                data = dict(row)
                
                # --- INTELLIGENT LOOKUPS ---

                # 1. PRODUCT UPLOAD (Maps Category Name -> ID)
                if model_name == 'product' and 'category' in data:
                    cat_name = data.pop('category')
                    cat_obj = Category.objects.filter(name__iexact=cat_name.strip()).first()
                    if not cat_obj:
                        raise Exception(f"Category '{cat_name}' not found. Upload Categories first.")
                    data['category'] = cat_obj 

                # 2. SELL/BUY POST UPLOAD (Maps Product Name -> ID & Seller Email -> ID)
                if model_name in ['product_sell', 'product_buy']:
                    # Lookup Product
                    if 'product' in data:
                        prod_name = data.pop('product')
                        prod_obj = Product.objects.filter(productName__iexact=prod_name.strip()).first()
                        if not prod_obj:
                            raise Exception(f"Product '{prod_name}' not found. Upload Products first.")
                        data['product'] = prod_obj
                        # Inherit Category from Product
                        data['category'] = prod_obj.category

                    # Lookup Customer (Seller/Buyer)
                    email_key = 'seller_email' if model_name == 'product_sell' else 'buyer_email'
                    if email_key in data:
                        email = data.pop(email_key)
                        cust_obj = Customer.objects.filter(email=email.strip()).first()
                        if not cust_obj:
                            raise Exception(f"Customer '{email}' not found.")
                        data['customer'] = cust_obj
                        
                        # Auto-fill display fields
                        if model_name == 'product_sell':
                            data['sellerName'] = cust_obj.name
                            data['phoneNo'] = cust_obj.phone
                        elif model_name == 'product_buy':
                            data['buyerName'] = cust_obj.name

                # 3. Create Record
                ModelClass.objects.create(**data)
                success_count += 1

            except Exception as e:
                errors.append(f"Row {row_num}: {str(e)}")
            
            row_num += 1

        return Response({
            "message": f"Uploaded {success_count} records successfully.",
            "errors": errors
        }, status=status.HTTP_200_OK)
    def post(self, request, model_name):
        file = request.FILES.get('file')
        if not file:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        decoded_file = file.read().decode('utf-8')
        io_string = io.StringIO(decoded_file)
        reader = csv.DictReader(io_string)
        
        success_count = 0
        errors = []
        
        # Map URL slug to actual Model Class
        model_mapping = {
            'category': apps.get_model('category', 'Category'),
            'product': apps.get_model('product', 'Product'),
            'product_sell': apps.get_model('product_sell', 'ProductSell'),
            'product_buy': apps.get_model('product_buy', 'ProductBuy'),
            'customer': apps.get_model('customer', 'Customer'),
            'plan': apps.get_model('plan', 'Plan')
        }

        ModelClass = model_mapping.get(model_name)
        if not ModelClass:
            return Response({"error": f"Invalid model name: {model_name}"}, status=status.HTTP_400_BAD_REQUEST)

        row_num = 1
        for row in reader:
            try:
                data = dict(row)
                
                # --- INTELLIGENT LOOKUPS ---

                # 1. PRODUCT UPLOAD (Maps Category Name -> ID)
                if model_name == 'product' and 'category' in data:
                    cat_name = data.pop('category')
                    cat_obj = Category.objects.filter(name__iexact=cat_name.strip()).first()
                    if not cat_obj:
                        raise Exception(f"Category '{cat_name}' not found. Upload Categories first.")
                    data['category'] = cat_obj # Assign object directly

                # 2. SELL/BUY POST UPLOAD (Maps Product Name -> ID & Seller Email -> ID)
                if model_name in ['product_sell', 'product_buy']:
                    if 'product' in data:
                        prod_name = data.pop('product')
                        prod_obj = Product.objects.filter(productName__iexact=prod_name.strip()).first()
                        if not prod_obj:
                            raise Exception(f"Product '{prod_name}' not found. Upload Products first.")
                        data['product'] = prod_obj
                        # Inherit Category from Product to keep data consistent
                        data['category'] = prod_obj.category

                    # Lookup Customer (Seller/Buyer)
                    email_key = 'seller_email' if model_name == 'product_sell' else 'buyer_email'
                    if email_key in data:
                        email = data.pop(email_key)
                        cust_obj = Customer.objects.filter(email=email.strip()).first()
                        if not cust_obj:
                            raise Exception(f"Customer '{email}' not found.")
                        data['customer'] = cust_obj
                        
                        # Auto-fill display fields
                        if model_name == 'product_sell':
                            data['sellerName'] = cust_obj.name
                            data['phoneNo'] = cust_obj.phone
                        elif model_name == 'product_buy':
                            data['buyerName'] = cust_obj.name

                # 3. Create Record
                ModelClass.objects.create(**data)
                success_count += 1

            except Exception as e:
                errors.append(f"Row {row_num}: {str(e)}")
            
            row_num += 1

        return Response({
            "message": f"Uploaded {success_count} records successfully.",
            "errors": errors
        }, status=status.HTTP_200_OK)
    def post(self, request, model_name):
        file = request.FILES.get('file')
        if not file:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        decoded_file = file.read().decode('utf-8')
        io_string = io.StringIO(decoded_file)
        reader = csv.DictReader(io_string)
        
        success_count = 0
        errors = []
        
        # Map URL slug to actual Model Class
        model_mapping = {
            'category': apps.get_model('category', 'Category'),
            'product_sell': apps.get_model('product_sell', 'ProductSell'),
            'customer': apps.get_model('customer', 'Customer'),
            'plan': apps.get_model('plan', 'Plan')
        }

        ModelClass = model_mapping.get(model_name)
        if not ModelClass:
            return Response({"error": "Invalid model name"}, status=status.HTTP_400_BAD_REQUEST)

        row_num = 1
        for row in reader:
            try:
                data = dict(row)
                
                # --- INTELLIGENT LOOKUPS (The "Human" logic) ---
                
                # 1. Handle Category Name -> ID
                if 'category' in data and model_name == 'product_sell':
                    cat_name = data.pop('category') # Remove name, replace with ID
                    cat_obj = Category.objects.filter(name__iexact=cat_name).first()
                    if cat_obj:
                        data['category_id'] = cat_obj.id
                    else:
                        raise Exception(f"Category '{cat_name}' not found")

                # 2. Handle Customer Email -> ID
                if 'seller_email' in data and model_name == 'product_sell':
                    email = data.pop('seller_email')
                    cust_obj = Customer.objects.filter(email=email).first()
                    if cust_obj:
                        data['customer_id'] = cust_obj.id
                        # Auto-fill text fields for display
                        data['sellerName'] = cust_obj.name
                        data['phoneNo'] = cust_obj.phone
                    else:
                        raise Exception(f"Customer email '{email}' not found")

                # 3. Create Record
                ModelClass.objects.create(**data)
                success_count += 1

            except Exception as e:
                errors.append(f"Row {row_num}: {str(e)}")
            
            row_num += 1

        return Response({
            "message": f"Uploaded {success_count} records successfully.",
            "errors": errors
        }, status=status.HTTP_200_OK)
```

---

## File: backend/user/models.py
```python
# Path: backend/user/models.py
from django.db import models

# Create your models here.
class User(models.Model):
    name = models.CharField(max_length = 100)
    email = models.EmailField()
    phone = models.CharField(max_length = 10)
    password = models.CharField(max_length=100, default='admin123') 


    def __str__(self):
        
        return self.name

```

---

## File: backend/user/tests.py
```python
# Path: backend/user/tests.py
from django.test import TestCase

# Create your tests here.

```

---

## File: backend/product_bid/serializer.py
```python
# Path: backend/product_bid/serializer.py
from rest_framework import serializers
from .models import ProductBid
from customer.serializer import CustomerSerializer

class ProductBidSerializer(serializers.ModelSerializer):
    # Nested serializer to show bidder name in frontend easily
    bidder_details = CustomerSerializer(source='bidder', read_only=True)

    class Meta:
        model = ProductBid
        fields = '__all__'
```

---

## File: backend/product_bid/admin.py
```python
# Path: backend/product_bid/admin.py
from django.contrib import admin

# Register your models here.

```

---

## File: backend/product_bid/urls.py
```python
# Path: backend/product_bid/urls.py
"""
URL configuration for restapi project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.urls import path
from . import views
from .views import ProductBidAPI
urlpatterns = [
    path("",views.ProductBidAPI.as_view()),
    path("<int:id>/",ProductBidAPI.as_view())
]

```

---

## File: backend/product_bid/__init__.py
```python
# Path: backend/product_bid/__init__.py

```

---

## File: backend/product_bid/apps.py
```python
# Path: backend/product_bid/apps.py
from django.apps import AppConfig


class ProductBidConfig(AppConfig):
    name = "product_bid"

```

---

## File: backend/product_bid/views.py
```python
# Path: backend/product_bid/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ProductBid
from .serializer import ProductBidSerializer

class ProductBidAPI(APIView):
    
    def get(self, request, id=None):
        # Filter logic
        sell_id = request.query_params.get('sell_id')
        buy_id = request.query_params.get('buy_id')

        bids = ProductBid.objects.all().order_by('-created_at')

        if sell_id:
            bids = bids.filter(sell_post_id=sell_id)
        elif buy_id:
            bids = bids.filter(buy_post_id=buy_id)
        
        serializer = ProductBidSerializer(bids, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ProductBidSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, id):
        # Used for Accepting/Rejecting Bids
        try:
            bid = ProductBid.objects.get(id=id)
        except ProductBid.DoesNotExist:
            return Response({"error": "Bid not found"}, status=status.HTTP_404_NOT_FOUND)

        # Allow partial updates (e.g., just updating 'status')
        serializer = ProductBidSerializer(bid, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```

---

## File: backend/product_bid/models.py
```python
# Path: backend/product_bid/models.py
from django.db import models
from customer.models import Customer
from product_sell.models import ProductSell
from product_buy.models import ProductBuy

class ProductBid(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('ACCEPTED', 'Accepted'),
        ('REJECTED', 'Rejected'),
    )

    # Who is bidding?
    bidder = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='bids')
    
    # What are they bidding on? (One will be null)
    sell_post = models.ForeignKey(ProductSell, on_delete=models.CASCADE, null=True, blank=True, related_name='bids')
    buy_post = models.ForeignKey(ProductBuy, on_delete=models.CASCADE, null=True, blank=True, related_name='bids')

    amount = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()
    message = models.CharField(max_length=500, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.bidder.name} - {self.amount}"
```

---

## File: backend/product_bid/tests.py
```python
# Path: backend/product_bid/tests.py
from django.test import TestCase

# Create your tests here.

```

---

## File: backend/product_buy/serializer.py
```python
# Path: backend/product_buy/serializer.py
# Path: backend/product_buy/serializer.py
from rest_framework import serializers
from .models import ProductBuy
import base64
import uuid
from django.core.files.base import ContentFile

class Base64ImageField(serializers.Field):
    def to_internal_value(self, data):
        if isinstance(data, str) and data.startswith('data:image'):
            try:
                format, imgstr = data.split(';base64,') 
                ext = format.split('/')[-1] 
                id = uuid.uuid4()
                data = ContentFile(base64.b64decode(imgstr), name=f"{id}.{ext}")
            except:
                raise serializers.ValidationError("Invalid image")
        return data

    def to_representation(self, value):
        if not value: return None
        try: return value.url
        except: return None

class ProductBuySerializer(serializers.ModelSerializer):
    productName = serializers.ReadOnlyField(source='product.productName')
    productImage = serializers.ReadOnlyField(source='product.productImage')

    image = Base64ImageField(required=False, allow_null=True)

    class Meta:
        model = ProductBuy
        fields = '__all__'
        read_only_fields = ['created_at', 'buyerName']
```

---

## File: backend/product_buy/admin.py
```python
# Path: backend/product_buy/admin.py
from django.contrib import admin

# Register your models here.

```

---

## File: backend/product_buy/urls.py
```python
# Path: backend/product_buy/urls.py
"""
URL configuration for restapi project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.urls import path
from . import views
from .views import ProductBuyAPI
urlpatterns = [
    path("",views.ProductBuyAPI.as_view()),
    path("<int:id>/", ProductBuyAPI.as_view())
]

```

---

## File: backend/product_buy/__init__.py
```python
# Path: backend/product_buy/__init__.py

```

---

## File: backend/product_buy/apps.py
```python
# Path: backend/product_buy/apps.py
from django.apps import AppConfig


class ProductBuyConfig(AppConfig):
    name = "product_buy"

```

---

## File: backend/product_buy/views.py
```python
# Path: backend/product_buy/views.py
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ProductBuy
from .serializer import ProductBuySerializer
from customer.models import Customer

class ProductBuyAPI(APIView):
    def post(self, request):
        serializer = ProductBuySerializer(data=request.data)
        if serializer.is_valid():
            try:
                # 1. Get Customer ID
                customer_id = request.data.get('customer')
                
                # 2. Fetch Customer Details
                current_customer = Customer.objects.get(id=customer_id)
                
                # 3. Save listing with Customer's Name
                serializer.save(buyerName=current_customer.name)
                
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Customer.DoesNotExist:
                 return Response({"error": "Customer not found"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # ... (Keep get, put, delete methods as they were) ...
    def get(self, request, id=None):
        if id:
            try:
                productBuy = ProductBuy.objects.get(id=id)
            except ProductBuy.DoesNotExist:
                return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)
            serializer = ProductBuySerializer(productBuy)
            return Response(serializer.data)

        productsBuy = ProductBuy.objects.all()
        
        category_id = request.query_params.get('category_id')
        if category_id:
            productsBuy = productsBuy.filter(product__category_id=category_id)

        customer_id = request.query_params.get('customer_id')
        if customer_id:
            productsBuy = productsBuy.filter(customer_id=customer_id)
            
        serializer = ProductBuySerializer(productsBuy, many=True)
        return Response(serializer.data)
    
    def put(self, request, id):
        try:
            productBuy = ProductBuy.objects.get(id=id)
        except ProductBuy.DoesNotExist:
            return Response({"error":"Not Found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = ProductBuySerializer(productBuy, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        try:
            productBuy = ProductBuy.objects.get(id=id)
        except ProductBuy.DoesNotExist:
            return Response({"error":"Not Found"}, status=status.HTTP_404_NOT_FOUND)
        productBuy.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
```

---

## File: backend/product_buy/models.py
```python
# Path: backend/product_buy/models.py
# Path: backend/product_buy/models.py
from django.db import models
from category.models import Category
from customer.models import Customer
from product.models import Product

class ProductBuy(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='buy_posts', null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='buy_listings', null=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='buy_products')
    image = models.FileField(upload_to='buy_uploads/', blank=True, null=True)
    name = models.CharField(max_length=50, blank=True, null=True, default="General")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    location = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField()
    buyerName = models.CharField(max_length=100) 
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        p_name = self.product.productName if self.product else "Unknown Product"
        return f"Buy: {p_name} - {self.buyerName}"
```

---

## File: backend/product_buy/tests.py
```python
# Path: backend/product_buy/tests.py
from django.test import TestCase

# Create your tests here.

```

---

## File: backend/plan/serializer.py
```python
# Path: backend/plan/serializer.py
from rest_framework import serializers
from .models import Plan

class PlanSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length = 100)
    duration= serializers.CharField(max_length=10000,default="No duration available")
    price= serializers.CharField(max_length = 10)


    class Meta:
        model = Plan
        fields = '__all__'
```

---

## File: backend/plan/admin.py
```python
# Path: backend/plan/admin.py
from django.contrib import admin

# Register your models here.

```

---

## File: backend/plan/urls.py
```python
# Path: backend/plan/urls.py
from django.urls import path
from . import views
from .views import PlanAPI
urlpatterns = [
    path("",views.PlanAPI.as_view()),
    path("<int:id>/",PlanAPI.as_view())

]


```

---

## File: backend/plan/__init__.py
```python
# Path: backend/plan/__init__.py

```

---

## File: backend/plan/apps.py
```python
# Path: backend/plan/apps.py
from django.apps import AppConfig


class PlanConfig(AppConfig):
    name = "plan"

```

---

## File: backend/plan/views.py
```python
# Path: backend/plan/views.py
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Plan
from .serializer import PlanSerializer

# Create your views here.
class PlanAPI(APIView):
    def post(self,request):
        
        serializer=PlanSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

    def get(self,request,id=None):
        if id:
            try:
                plan= Plan.objects.get(id=id)
            except Plan.DoesNotExist:
                return Response({"error":"Not Found"},status=status.HTTP_404_NOT_FOUND)
            
            serializer = PlanSerializer(plan)
            return Response(serializer.data)
        plans = Plan.objects.all()
        serializer = PlanSerializer(plans, many = True)
        return Response(serializer.data)
    
    def put(self,request,id):   
        try:
            plan= Plan.objects.get(id=id)
        except Plan.DoesNotExist:
            return Response({"error":"Not Found"},status=status.HTTP_404_NOT_FOUND)
            
        serializer = PlanSerializer(plan, data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.error, status = status.HTTP_400_BAD_REQUEST)
    def delete(self,request,id):
        try:
            plan= Plan.objects.get(id=id)
        except Plan.DoesNotExist:
            return Response({"error":"Not Found"},status=status.HTTP_404_NOT_FOUND)
        plan.delete()
        return Response({"messsage":"Deleted"},status=status.HTTP_204_NO_CONTENT)




    
        
    



```

---

## File: backend/plan/models.py
```python
# Path: backend/plan/models.py
from django.db import models

# Create your models here.
class Plan(models.Model):
    name = models.CharField(max_length = 100)
    duration= models.CharField(max_length=10000,default="No duration available")
    price = models.CharField(max_length = 10)

    def __str__(self):
        
        return self.name



```

---

## File: backend/plan/tests.py
```python
# Path: backend/plan/tests.py
from django.test import TestCase

# Create your tests here.

```

---

## File: backend/product_sell/serializer.py
```python
# Path: backend/product_sell/serializer.py
# Path: backend/product_sell/serializer.py
from rest_framework import serializers
from .models import ProductSell
import base64
import uuid
from django.core.files.base import ContentFile

# Custom Field to handle Base64 decoding
class Base64ImageField(serializers.Field):
    def to_internal_value(self, data):
        # Check if this is a base64 string
        if isinstance(data, str) and data.startswith('data:image'):
            # format: "data:image/png;base64,iVBORw0KGgo..."
            try:
                format, imgstr = data.split(';base64,') 
                ext = format.split('/')[-1] 
                id = uuid.uuid4()
                data = ContentFile(base64.b64decode(imgstr), name=f"{id}.{ext}")
            except Exception as e:
                raise serializers.ValidationError("Invalid image format")
        return data

    def to_representation(self, value):
        if not value:
            return None
        try:
            return value.url
        except:
            return None

class ProductSellSerializer(serializers.ModelSerializer):
    productName = serializers.ReadOnlyField(source='product.productName')
    productImage = serializers.ReadOnlyField(source='product.productImage') # Fallback URL
    
    # Use the custom field
    image = Base64ImageField(required=False, allow_null=True)

    class Meta:
        model = ProductSell
        fields = '__all__'
        read_only_fields = ['created_at', 'sellerName', 'phoneNo']

    def validate_price(self, value):
        if value <= 0: raise serializers.ValidationError('price must be positive')
        return value
```

---

## File: backend/product_sell/admin.py
```python
# Path: backend/product_sell/admin.py
# Path: backend/product_sell/admin.py
from django.contrib import admin
from .models import ProductSell

admin.site.register(ProductSell)
```

---

## File: backend/product_sell/urls.py
```python
# Path: backend/product_sell/urls.py
"""
URL configuration for restapi project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.urls import path
from . import views
from .views import ProductSellAPI
urlpatterns = [
    path("",views.ProductSellAPI.as_view()),
    path("<int:id>/", ProductSellAPI.as_view())
]

```

---

## File: backend/product_sell/__init__.py
```python
# Path: backend/product_sell/__init__.py

```

---

## File: backend/product_sell/apps.py
```python
# Path: backend/product_sell/apps.py
from django.apps import AppConfig


class ProductSellConfig(AppConfig):
    name = "product_sell"

```

---

## File: backend/product_sell/views.py
```python
# Path: backend/product_sell/views.py
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ProductSell
from .serializer import ProductSellSerializer
from customer.models import Customer # Import Customer model

class ProductSellAPI(APIView):
    def post(self, request):
        serializer = ProductSellSerializer(data=request.data)
        if serializer.is_valid():
            try:
                # 1. Get Customer ID from request
                customer_id = request.data.get('customer')
                
                # 2. Fetch Customer Details
                current_customer = Customer.objects.get(id=customer_id)
                
                # 3. Save listing with Customer's Name and Phone
                serializer.save(
                    sellerName=current_customer.name, 
                    phoneNo=current_customer.phone
                )
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Customer.DoesNotExist:
                return Response({"error": "Customer not found"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # ... (Keep get, put, delete methods as they were) ...
    def get(self, request, id=None):
        if id:
            try:
                productSell = ProductSell.objects.get(id=id)
            except ProductSell.DoesNotExist:
                return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)
            serializer = ProductSellSerializer(productSell)
            return Response(serializer.data)

        productsSell = ProductSell.objects.all()
        
        customer_id = request.query_params.get('customer_id')
        if customer_id:
            productsSell = productsSell.filter(customer_id=customer_id)

        category_id = request.query_params.get('category_id')
        if category_id:
            productsSell = productsSell.filter(product__category_id=category_id)
        
        serializer = ProductSellSerializer(productsSell, many=True)
        return Response(serializer.data)

    def put(self,request,id):
        try:
            productSell= ProductSell.objects.get(id=id)
        except ProductSell.DoesNotExist:
            return Response({"error":"Not Found"},status=status.HTTP_404_NOT_FOUND)
            
        serializer = ProductSellSerializer(productSell, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self,request,id):
        try:
            productSell= ProductSell.objects.get(id=id)
        except ProductSell.DoesNotExist:
            return Response({"error":"Not Found"},status=status.HTTP_404_NOT_FOUND)
        productSell.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
```

---

## File: backend/product_sell/models.py
```python
# Path: backend/product_sell/models.py
# Path: backend/product_sell/models.py
from django.db import models
from category.models import Category
from customer.models import Customer
from product.models import Product  

class ProductSell(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='sell_posts', null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='sell_listings', null=True) 
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='sell_products', null=True, blank=True)
    image = models.FileField(upload_to='sell_uploads/', blank=True, null=True)
    name = models.CharField(max_length=50, blank=True, null=True, default="General")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    location = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField()
    description = models.CharField(max_length=500)
    sellerName = models.CharField(max_length=50) 
    phoneNo = models.CharField(max_length=15)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        # Safe string representation
        p_name = self.product.productName if self.product else "Unknown Product"
        return f"{p_name} by {self.sellerName}"
```

---

## File: backend/product_sell/tests.py
```python
# Path: backend/product_sell/tests.py
from django.test import TestCase

# Create your tests here.

```

---

