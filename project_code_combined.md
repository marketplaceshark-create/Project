## File: ProblemStatement.md
```
# Path: ProblemStatement.md
***

# **Project Specification: B2B Agricultural Marketplace**

## **1. Problem Statement**

**The Challenge: Inefficiency and Rigidity in Agricultural Trading**
The current agricultural B2B landscape is fragmented. Farmers, Wholesalers, and Processors ("Customers") face significant barriers to efficient trading:

1.  **Geographical & Network Limitations:** Customers are largely restricted to their local networks or *mandis*, limiting their ability to find buyers or sellers nationwide who might offer better terms.
2.  **Lack of Price Optimization:** Without a competitive bidding environment, sellers often settle for the first available offer rather than the best market price. Conversely, buyers cannot easily compare rates from multiple sources.
3.  **Rigid Transaction Sizes:** Traditional trade often demands "all-or-nothing" deals. There is no streamlined digital mechanism for a large seller to fulfill their stock through multiple smaller buyers (partial fulfillment) without complex manual coordination.
4.  **Opaque Communication:** Finding a counter-party often involves layers of middlemen, preventing direct contact and negotiation between the actual buyer and seller.

**The Solution:**
A simplified, web-based platform that facilitates **direct B2B connections** through a transparent **bidding and negotiation engine**. The platform enables users to act interchangeably as buyers or sellers, democratizing access to the national market while allowing flexible, partial fulfillment of orders.

---

## **2. Core Logic & Business Rules**

### **A. User Roles & Visibility**
*   **Unified Role:** All users (Farmers, Wholesalers, Processors) are "Customers."
*   **Public Data:** Post Title, Category, Product, Quantity, Price, Customer Name, and Location (State/District) are visible to all users.
*   **Private Data:** Email and Phone Number are **hidden** until a bid is formally **Accepted**.

### **B. Inventory & Bidding Logic**
1.  **Placing a Bid:**
    *   Bidders input: **Price**, **Quantity**, and a **Message** (e.g., location details).
    *   *Validation:* Bid Quantity cannot exceed the Post's current available quantity.
    *   *Note:* Placing a bid **does not** reserve the stock. Multiple users can bid for the full amount simultaneously.

2.  **Acceptance & Partial Fulfillment:**
    *   **Action:** The Post Owner manually reviews bids and clicks "Accept."
    *   **Inventory Deduction:** Quantity is deducted from the Post **only when a bid is Accepted**.
    *   **Partial Logic:** A Post Owner can accept multiple smaller bids until the post quantity reaches 0.

3.  **Concurrency / Race Condition Handling:**
    *   *Scenario:* A Post has 10 Tons. User A bids for 10 Tons. User B bids for 10 Tons. Both bids are "Pending."
    *   *Outcome:* The Post Owner sees both. If the Owner accepts User A's bid:
        1.  Post Quantity becomes 0.
        2.  User A's Bid becomes "Accepted."
        3.  User B's Bid status automatically updates to **"INVALID"**.
    *   *System Check:* The system must prevent the Owner from accepting User B's bid after User A's bid has already consumed the stock.

4.  **The "Invalid Bid" State:**
    *   **Trigger:** When `Remaining Post Quantity` drops below a `Pending Bid Quantity`.
    *   **Action:** The system changes the bid status to **"INVALID"** and sends an **Email Notification** to the Bidder.
    *   **Restriction:** The Post Owner **cannot** accept an "Invalid" bid.
    *   **Resolution:** The Bidder must edit the bid (lowering quantity) or Cancel it.

### **C. Negotiation Flow**
1.  **Pending:** Bid placed; awaiting Owner action.
2.  **Accepted:** Owner accepts. Contact details exchanged. Quantity deducted.
3.  **Rejected:** Owner rejects. Bidder can submit a revised price/quantity.
4.  **Invalid:** Post quantity is insufficient for this bid.
5.  **Cancelled:** Withdrawn by the bidder.

### **D. Subscription & Listing Model**
*   **Free Tier:** 3 free posts per account.
*   **Paid Plans:** Users purchase plans to add more posts (e.g., 10 posts with 30-day posting validity).
*   **Plan Validity Rule:** Validity applies to the *ability to create new posts*.
    *   If a plan expires, the user cannot create new posts.
    *   **Existing posts remain active** indefinitely (until the user deletes them or stock is sold out).
    *   Users can edit existing posts without an active plan.

### **E. Notifications (MVP)**
*   **Channel:** Email Only (SMS/WhatsApp planned for future).
*   **Triggers:** New Bid, Bid Accepted (Unlock Contact Info), Bid Rejected, Bid Invalidated.

---

## **3. Search & Filters**
To ensure high liquidity and discoverability, the platform includes:
*   **Text Search:** By Product Name.
*   **Filters:**
    *   **Category** (Grains, Pulses, Spices, etc.)
    *   **Product** (Wheat, Soybeans, etc.)
    *   **Location** (State / District filtering)
    *   **Price Range** (Min / Max)

---

### **Developer Note: The "Accept" Button Logic**
*   **Critical Check:** When the Post Owner clicks "Accept" on a bid, the backend must perform a final check:
    *   `IF (Current_Post_Quantity >= Bid_Quantity) THEN Process_Acceptance`
    *   `ELSE Return_Error("Insufficient Quantity. Please Reject or wait for Bidder to update.")`
    *   This prevents negative inventory if two admins/users try to accept different bids on the same post simultaneously (rare but possible).
```

---

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
    <link href="css/styles.css" rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
    <script src="app.js"></script>
    <style>
        .admin-layout { display: flex; height: 100vh; overflow: hidden; }
        .sidebar { width: 260px; background: #1e293b; color: #94a3b8; flex-shrink: 0; display: flex; flex-direction: column; }
        .sidebar-brand { padding: 25px; color: white; font-weight: 700; font-size: 1.2rem; border-bottom: 1px solid #334155; }
        .nav-item-admin { padding: 12px 25px; cursor: pointer; transition: 0.2s; display: flex; align-items: center; border-left: 4px solid transparent; }
        .nav-item-admin:hover { color: white; background: #334155; }
        .nav-item-admin.active { background: #0f172a; color: #4ade80; border-left-color: #4ade80; }
        .main-content { flex-grow: 1; background: #f1f5f9; overflow-y: auto; padding: 30px; }
        .table-card { background: white; border-radius: 16px; box-shadow: var(--shadow-sm); overflow: hidden; }
        .table thead th { background: #f8fafc; color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 0.8rem; border-bottom: 2px solid #e2e8f0; }
    </style>
</head>
<body ng-controller="AdminDashCtrl">

    <div class="admin-layout">
        <!-- SIDEBAR -->
        <div class="sidebar">
            <div class="sidebar-brand"><i class="bi bi-shield-check me-2 text-success"></i> Admin Panel</div>
            <div class="mt-4">
                <div class="nav-item-admin" ng-class="{'active': activeTab=='categories'}" ng-click="switchTab('categories')"><i class="bi bi-tags me-3"></i> Categories</div>
                <div class="nav-item-admin" ng-class="{'active': activeTab=='products'}" ng-click="switchTab('products')"><i class="bi bi-box-seam me-3"></i> Products</div>
                <div class="nav-item-admin" ng-class="{'active': activeTab=='plans'}" ng-click="switchTab('plans')"><i class="bi bi-credit-card me-3"></i> Plans</div>
                <div class="nav-item-admin" ng-class="{'active': activeTab=='customers'}" ng-click="switchTab('customers')"><i class="bi bi-people me-3"></i> Customers</div>
            </div>
            <div class="mt-auto p-4 border-top border-secondary">
                <a href="index.html" class="btn btn-outline-secondary w-100 text-light border-secondary btn-sm">Exit to Site</a>
            </div>
        </div>

        <!-- MAIN -->
        <div class="main-content">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h3 class="fw-bold text-dark text-capitalize m-0">{{activeTab.replace('_', ' ')}} Management</h3>
                <div class="d-flex gap-2">
                    <form class="d-flex bg-white p-1 rounded shadow-sm border">
                        <input type="file" id="csvFile" class="form-control form-control-sm border-0 shadow-none" accept=".csv">
                        <button type="button" class="btn btn-dark btn-sm rounded" ng-click="uploadCSV()"><i class="bi bi-upload"></i></button>
                    </form>
                    <button class="btn btn-success btn-sm px-3 fw-bold rounded-pill shadow-sm" data-bs-toggle="modal" data-bs-target="#editModal" ng-click="openAdd()"><i class="bi bi-plus-lg me-1"></i> Add New</button>
                </div>
            </div>

            <div class="table-card">
                <table class="table table-hover mb-0 align-middle">
                    <thead><tr><th ng-repeat="field in currentSchema">{{field.label}}</th><th class="text-end">Actions</th></tr></thead>
                    <tbody>
                        <tr ng-repeat="row in tableData">
                            <td ng-repeat="field in currentSchema">
                                <span ng-if="!field.key.includes('Image')">{{row[field.key]}}</span>
                                <img ng-if="field.key.includes('Image')" ng-src="{{row[field.key]}}" style="height:35px; border-radius: 6px;">
                            </td>
                            <td class="text-end">
                                 <button class="btn btn-light btn-sm text-primary" ng-click="editRow(row)" data-bs-toggle="modal" data-bs-target="#editModal"><i class="bi bi-pencil-fill"></i></button>
                                 <button class="btn btn-light btn-sm text-danger" ng-click="deleteRow(row.id)"><i class="bi bi-trash-fill"></i></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div ng-if="tableData.length === 0" class="p-5 text-center text-muted">No records found.</div>
            </div>
        </div>
    </div>

    <!-- MODAL -->
    <div class="modal fade" id="editModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg rounded-4">
                <div class="modal-header bg-success text-white rounded-top-4">
                    <h5 class="modal-title fw-bold">{{ editMode ? 'Edit' : 'Add' }} Record</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-4">
                    <form id="adminForm">
                        <div class="mb-3" ng-repeat="field in currentSchema">
                            <label class="form-label small fw-bold text-muted text-uppercase">{{field.label}}</label>
                            
                            <input ng-if="field.type != 'textarea' && field.type != 'select'" type="{{field.type}}" class="form-control" ng-model="currentItem[field.key]">
                            
                            <textarea ng-if="field.type == 'textarea'" class="form-control" rows="3" ng-model="currentItem[field.key]"></textarea>
                            
                            <select ng-if="field.type == 'select'" class="form-select" ng-model="currentItem[field.key]" ng-options="opt.id as opt.name for opt in getOptions(field.options)">
                                <option value="">Select {{field.label}}</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div class="modal-footer border-0 pt-0">
                    <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-success rounded-pill px-4" ng-click="saveRow()">Save Changes</button>
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
    <link href="css/styles.css" rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
    <script src="app.js"></script>
    <style>
        .cat-icon { 
            width: 80px; 
            height: 80px; 
            background: #f1f8e9; 
            color: #2E7D32; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-size: 2.5rem; 
            margin: 0 auto 20px; 
            transition: 0.3s; 
        }
        .category-card:hover .cat-icon { 
            background: #2E7D32; 
            color: white; 
        }
        .category-card {
            border: 1px solid #eee;
            border-radius: 12px;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .category-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.05);
        }
    </style>
</head>
<body ng-controller="CategoryPageCtrl">

    <div ng-include="'components/navbar.html'" ng-init="activePage='category'"></div>

    <div class="bg-light py-5 text-center border-bottom">
        <div class="container">
            <h1 class="fw-bold text-success">Browse Categories</h1>
            <p class="text-muted">Find exactly what you need</p>
            <div class="position-relative mx-auto" style="max-width: 500px;">
                <input type="text" class="form-control rounded-pill py-3 px-4 shadow-sm" 
                       ng-model="searchQuery" 
                       placeholder="Search categories or specific products (e.g. 'Tomato')...">
            </div>
        </div>
    </div>

    <div class="container py-5">
        <div class="row g-4">
            <!-- This loop uses the 'categories' array, which MUST be dynamically loaded from the backend API -->
            <div class="col-lg-3 col-md-4 col-sm-6" ng-repeat="cat in categories | filter:categoryFilter">
                <div class="category-card p-4 text-center h-100" ng-click="goToMarket(cat)" style="cursor:pointer">
                    
                    <div class="cat-icon">
                        <i class="bi" ng-class="getCategoryIcon(cat.name)"></i>
                    </div>
                    <h5 class="fw-bold text-dark">{{cat.name}}</h5>
                    <p class="text-muted small">{{cat.description | limitTo:60}}...</p>
                    
                    <hr class="my-3 opacity-25">

                    <div ng-if="searchQuery" class="mb-3">
                        <div class="d-flex flex-wrap justify-content-center gap-1">
                            <span class="badge bg-success-subtle text-success border border-success px-2 py-1" 
                                  ng-repeat="p in cat.productList | filter:searchQuery | limitTo:2">
                                <i class="bi bi-search small me-1"></i>Found: {{p}}
                            </span>
                        </div>
                    </div>

                    <div class="mt-auto">
                        <span class="text-success fw-bold small">View Products <i class="bi bi-arrow-right"></i></span>
                    </div>
                </div>
            </div>
        </div>

        <div class="text-center text-muted py-5" ng-if="(categories | filter:categoryFilter).length === 0">
            <div ng-if="!searchQuery && categories.length === 0">
                <div class="spinner-border text-success mb-3"></div>
                <p>Loading categories...</p>
            </div>
            <div ng-if="!searchQuery && categories.length > 0">
                 <i class="bi bi-grid-3x3-gap display-4 text-muted mb-3"></i>
                 <p class="fs-5">No categories matched your search filters.</p>
            </div>
            <div ng-if="searchQuery">
                <i class="bi bi-search-heart display-4 text-warning mb-3"></i>
                <p class="fs-5">No categories found matching "<strong>{{searchQuery}}</strong>"</p>
                <button class="btn btn-outline-success btn-sm mt-2" ng-click="searchQuery = ''">Clear Search</button>
            </div>
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
    <title>Dashboard - Agrivendia</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
    <link href="css/styles.css" rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
    <script src="app.js"></script>
</head>
<body ng-controller="CustomerDashCtrl" style="background: #f8f9fa;">
    
    <div id="toast-container">
        <div class="custom-toast" ng-repeat="t in toasts" ng-class="t.type">
            <div class="toast-icon"><i class="bi" ng-class="{'bi-check-circle-fill': t.type=='success', 'bi-x-circle-fill': t.type=='error'}"></i></div>
            <div class="fw-bold">{{t.message}}</div>
        </div>
    </div>

    <div ng-include="'components/navbar.html'" ng-init="activePage='dashboard'"></div>

    <div class="container py-5">
        <!-- HEADER -->
        <div class="d-flex justify-content-between align-items-center mb-5">
            <div class="d-flex align-items-center">
                <div class="me-4 position-relative">
                     <img ng-src="{{ getImageUrl(currentUser) || 'https://via.placeholder.com/150' }}" 
                          class="rounded-circle shadow-sm border border-3 border-white" 
                          style="width: 80px; height: 80px; object-fit: cover;">
                </div>
                <div>
                    <h2 class="fw-bold m-0 text-dark">Hello, {{currentUser.name}}</h2>
                    <p class="text-muted m-0">Manage your listings</p>
                </div>
            </div>
            <button ng-click="logout()" class="btn btn-outline-danger rounded-pill px-4 btn-sm">Logout</button>
        </div>

        <!-- STATS -->
        <div class="row g-4 mb-5">
            <div class="col-md-4">
                <div class="stat-card">
                    <div><div class="text-muted small fw-bold text-uppercase">Active Sales</div><h2 class="fw-bold text-dark m-0">{{myListings.length}}</h2></div>
                    <div class="stat-icon bg-success-subtle text-success"><i class="bi bi-shop"></i></div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="stat-card">
                    <div><div class="text-muted small fw-bold text-uppercase">Buy Requests</div><h2 class="fw-bold text-dark m-0">{{myBuyRequests.length}}</h2></div>
                    <div class="stat-icon bg-primary-subtle text-primary"><i class="bi bi-cart"></i></div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="stat-card">
                    <div><div class="text-muted small fw-bold text-uppercase">Pending Bids</div><h2 class="fw-bold text-dark m-0">{{incomingBidsCount}}</h2></div>
                    <div class="stat-icon bg-warning-subtle text-warning"><i class="bi bi-bell"></i></div>
                </div>
            </div>
        </div>

        <!-- TABS & CONTENT -->
        <div class="bg-white p-4 rounded-4 shadow-sm border">
            <!-- REMOVED SETTINGS TAB FROM HERE -->
            <ul class="nav nav-pills nav-fill mb-4 p-1 bg-light rounded-pill" style="max-width: 600px; margin: 0 auto;">
                <li class="nav-item">
                    <a class="nav-link rounded-pill" ng-class="{'active bg-white shadow-sm text-success': activeTab == 'sell'}" ng-click="activeTab = 'sell'" href="#">My Sales</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link rounded-pill" ng-class="{'active bg-white shadow-sm text-primary': activeTab == 'requests'}" ng-click="activeTab = 'requests'" href="#">My Requests</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link rounded-pill" ng-class="{'active bg-white shadow-sm text-dark': activeTab == 'bids'}" ng-click="activeTab = 'bids'" href="#">My Offers</a>
                </li>
            </ul>

            <!-- 1. MY SALES -->
            <div ng-show="activeTab == 'sell'">
                <div class="text-end mb-3"><a href="product_sell.html" class="btn btn-primary-custom rounded-pill btn-sm"><i class="bi bi-plus-lg"></i> Sell Produce</a></div>
                <div class="card mb-3 border-0 shadow-sm" ng-repeat="item in myListings">
                    <div class="card-body p-4">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="d-flex align-items-center">
                                <div class="bg-success-subtle p-3 rounded-circle me-3 text-success"><i class="bi bi-box-seam fs-4"></i></div>
                                <div>
                                    <h5 class="fw-bold mb-1"><a href="product_detail.html?id={{item.id}}&type=sell" class="text-dark text-decoration-none">{{item.productName}}</a></h5>
                                    <div class="text-muted small">₹{{item.price}} • {{item.quantity}} {{item.unit}} • {{item.location}}</div>
                                </div>
                            </div>
                            <div>
                                <button class="btn btn-light btn-sm rounded-pill text-danger me-2" ng-click="deletePost(item.id, 'sell')"><i class="bi bi-trash"></i></button>
                                <button class="btn btn-outline-custom btn-sm rounded-pill" ng-click="item.showBids = !item.showBids">
                                    {{item.showBids ? 'Close' : 'Offers'}}
                                    <span class="badge bg-danger ms-1" ng-if="getPendingBidCount(item.id, 'sell') > 0">{{getPendingBidCount(item.id, 'sell')}}</span>
                                </button>
                            </div>
                        </div>
                        <div ng-if="item.showBids" class="mt-4 bg-light p-3 rounded-3">
                            <div ng-if="getBidsForProduct(item.id, 'sell').length == 0" class="text-center text-muted small py-2">No offers yet.</div>
                            <div ng-repeat="bid in getBidsForProduct(item.id, 'sell')" class="d-flex justify-content-between align-items-center bg-white p-3 rounded mb-2 border">
                                <div><span class="fw-bold">{{bid.bidder_details.name}}</span> offers <span class="text-success fw-bold">₹{{bid.amount}}</span></div>
                                <div>
                                    <div ng-if="bid.status == 'PENDING'">
                                        <button class="btn btn-success btn-sm rounded-pill px-3" ng-click="updateBid(bid, 'ACCEPTED')">Accept</button>
                                        <button class="btn btn-outline-danger btn-sm rounded-pill px-3" ng-click="updateBid(bid, 'REJECTED')">Decline</button>
                                    </div>
                                    <span ng-if="bid.status != 'PENDING'" class="badge" ng-class="{'bg-success': bid.status=='ACCEPTED', 'bg-danger': bid.status=='REJECTED'}">{{bid.status}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div ng-if="myListings.length == 0" class="text-center text-muted py-5">No active sales listings.</div>
            </div>

            <!-- 2. MY REQUESTS -->
            <div ng-show="activeTab == 'requests'">
                <div class="text-end mb-3"><a href="product_buy.html" class="btn btn-primary-custom rounded-pill btn-sm"><i class="bi bi-plus-lg"></i> Post Request</a></div>
                <div class="card mb-3 border-0 shadow-sm" ng-repeat="item in myBuyRequests">
                    <div class="card-body p-4">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="d-flex align-items-center">
                                <div class="bg-primary-subtle p-3 rounded-circle me-3 text-primary"><i class="bi bi-basket fs-4"></i></div>
                                <div>
                                    <h5 class="fw-bold mb-1"><a href="product_detail.html?id={{item.id}}&type=buy" class="text-dark text-decoration-none">{{item.productName || item.name}}</a></h5>
                                    <div class="text-muted small">Target: ₹{{item.price}} • Need {{item.quantity}} {{item.unit}}</div>
                                </div>
                            </div>
                            <div>
                                <button class="btn btn-light btn-sm rounded-pill text-danger me-2" ng-click="deletePost(item.id, 'buy')"><i class="bi bi-trash"></i></button>
                                <button class="btn btn-outline-custom btn-sm rounded-pill" ng-click="item.showBids = !item.showBids">View Sellers</button>
                            </div>
                        </div>
                        <div ng-if="item.showBids" class="mt-4 bg-light p-3 rounded-3">
                            <div ng-if="getBidsForProduct(item.id, 'buy').length == 0" class="text-center text-muted small">No sellers yet.</div>
                            <div ng-repeat="bid in getBidsForProduct(item.id, 'buy')" class="d-flex justify-content-between align-items-center bg-white p-3 rounded mb-2 border">
                                <div><span class="fw-bold">{{bid.bidder_details.name}}</span> offers stock at <span class="text-success fw-bold">₹{{bid.amount}}</span></div>
                                <span class="badge" ng-class="{'bg-success': bid.status=='ACCEPTED', 'bg-warning text-dark': bid.status=='PENDING'}">{{bid.status}}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div ng-if="myBuyRequests.length == 0" class="text-center text-muted py-5">No buy requests posted.</div>
            </div>

            <!-- 3. MY BIDS -->
            <div ng-show="activeTab == 'bids'">
                <div class="row g-4">
                    <div class="col-md-6" ng-repeat="bid in myBids">
                        <div class="card h-100 border-0 shadow-sm">
                            <div class="card-body p-4">
                                <div class="d-flex justify-content-between mb-3">
                                    <span class="badge rounded-pill bg-light text-dark border">ID #{{bid.id}}</span>
                                    <span class="badge rounded-pill" ng-class="{'bg-warning text-dark': bid.status=='PENDING', 'bg-success': bid.status=='ACCEPTED', 'bg-danger': bid.status=='REJECTED'}">{{bid.status}}</span>
                                </div>
                                <h5 class="fw-bold mb-3">
                                     <a ng-if="bid.sell_post" href="product_detail.html?id={{bid.sell_post}}&type=sell" class="text-dark">View Listing <i class="bi bi-box-arrow-up-right"></i></a>
                                     <a ng-if="bid.buy_post" href="product_detail.html?id={{bid.buy_post}}&type=buy" class="text-dark">View Listing <i class="bi bi-box-arrow-up-right"></i></a>
                                </h5>
                                <div class="p-3 bg-light rounded">
                                    <div class="d-flex justify-content-between"><span class="text-muted">Your Offer:</span><span class="fw-bold text-success">₹{{bid.amount}}</span></div>
                                </div>
                            </div>
                        </div>
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
    <link href="css/styles.css" rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
    <script src="app.js"></script>
    <style>
        /* Updated Sidebar CSS for Scrolling */
        .sidebar-sticky { 
            position: sticky; 
            top: 90px; /* Distance from top of browser */
            z-index: 5; 
            max-height: calc(100vh - 110px); /* Height minus navbar/padding */
            overflow-y: auto; /* Enable vertical scrolling */
            padding-right: 5px; /* Prevent scrollbar overlapping content */
        }
        
        /* Optional: Custom Scrollbar for nicer look */
        .sidebar-sticky::-webkit-scrollbar { width: 6px; }
        .sidebar-sticky::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
        .sidebar-sticky::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 4px; }
        .sidebar-sticky::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }

        .filter-group { 
            background: white; 
            padding: 20px; 
            border-radius: 16px; 
            margin-bottom: 20px; 
            box-shadow: var(--shadow-sm); 
        }
    </style>
</head>
<body ng-controller="MarketCtrl">

    <div ng-include="'components/navbar.html'" ng-init="activePage='market'"></div>

    <div class="container py-5">
        <div class="row g-4">
            <!-- FILTER SIDEBAR -->
            <div class="col-lg-3">
                <div class="sidebar-sticky">
                    <div class="filter-group">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h6 class="fw-bold m-0"><i class="bi bi-sliders"></i> Filters</h6>
                            <a href="#" ng-click="resetFilters()" class="small text-danger fw-bold text-decoration-none">Clear</a>
                        </div>
                        <hr class="text-muted opacity-25">
                        
                        <!-- Listing Type -->
                        <label class="small fw-bold text-muted text-uppercase mb-2">Listing Type</label>
                        <div class="form-check mb-1">
                            <input class="form-check-input" type="radio" name="type" ng-model="filters.type" value="sell" ng-change="applyFilters()">
                            <label class="form-check-label">For Sale</label>
                        </div>
                        <div class="form-check mb-3">
                            <input class="form-check-input" type="radio" name="type" ng-model="filters.type" value="buy" ng-change="applyFilters()">
                            <label class="form-check-label">Buy Requests</label>
                        </div>

                        <!-- Category Filter -->
                        <label class="small fw-bold text-muted text-uppercase mb-2">Category</label>
                        <select class="form-select form-select-sm mb-3" 
                                ng-model="filters.categoryId" 
                                ng-change="applyFilters()"
                                ng-options="c.id as c.name for c in categories">
                            <option value="">All Categories</option>
                        </select>

                        <!-- Product Filter -->
                        <label class="small fw-bold text-muted text-uppercase mb-2">Product</label>
                        <select class="form-select form-select-sm mb-3" 
                                ng-model="filters.productId" 
                                ng-change="applyFilters()"
                                ng-options="p.id as p.productName for p in masterProducts | filter: {category: filters.categoryId}">
                            <option value="">All Products</option>
                        </select>

                        <!-- Price Range Filter -->
                        <label class="small fw-bold text-muted text-uppercase mb-2">Price Range (₹)</label>
                        <div class="d-flex gap-2 mb-3">
                            <input type="number" class="form-control form-control-sm" placeholder="Min" ng-model="filters.minPrice" ng-change="applyFilters()">
                            <input type="number" class="form-control form-control-sm" placeholder="Max" ng-model="filters.maxPrice" ng-change="applyFilters()">
                        </div>

                        <!-- Location Searchable Textbox -->
                        <label class="small fw-bold text-muted text-uppercase mb-2">Location</label>
                        <input class="form-control form-control-sm" list="locationOptions" ng-model="filters.location" ng-change="applyFilters()" placeholder="Type city...">
                        <datalist id="locationOptions">
                            <option ng-repeat="loc in locations" value="{{loc}}">
                        </datalist>
                    </div>
                </div>
            </div>

            <!-- PRODUCT GRID -->
            <div class="col-lg-9">
                <!-- Search -->
                <div class="position-relative mb-4">
                    <i class="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                    <input type="text" class="form-control rounded-pill py-3 ps-5 shadow-sm border-0" placeholder="Search crops, fruits, grains..." ng-model="filters.search" ng-change="applyFilters()">
                </div>

                <div class="row g-4">
                    <div class="col-md-4 col-sm-6" ng-repeat="item in filteredItems">
                        <div class="card-hover" ng-click="openItem(item)" style="cursor: pointer;">
                            <div class="prod-img-wrap">
                                <div class="badge-float" ng-if="item.type==='sell'"><i class="bi bi-tag-fill"></i> Sale</div>
                                <div class="badge-float bg-primary text-white" ng-if="item.type==='buy'"><i class="bi bi-basket-fill"></i> Wanted</div>
                                
                                <img ng-src="{{ getImageUrl(item) }}" ng-if="getImageUrl(item)">
                                <div ng-if="!getImageUrl(item)" class="d-flex align-items-center justify-content-center h-100 bg-light text-muted">
                                    <i class="bi bi-image fs-1 opacity-25"></i>
                                </div>
                            </div>

                            <div class="prod-body d-flex flex-column" style="min-height: 180px;">
                                <div class="prod-title text-truncate">{{item.name || item.productName}}</div>
                                <div class="prod-loc"><i class="bi bi-geo-alt-fill text-danger small"></i> {{item.location}}</div>
                                
                                <div class="mt-auto pt-3 border-top">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div>
                                            <div class="small text-muted text-uppercase fw-bold" style="font-size: 0.7rem;">Price</div>
                                            <div class="prod-price small">₹{{item.price}} <span class="text-muted fw-normal fs-6">/ {{item.unit || 'kg'}}</span></div>
                                        </div>
                                        <div class="text-end">
                                            <div class="small text-muted text-uppercase fw-bold" style="font-size: 0.7rem;">Qty</div>
                                            <div class="fw-bold">{{item.quantity}} <span class="small">{{item.unit || 'kg'}}</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div ng-if="filteredItems.length === 0" class="text-center py-5">
                    <div class="text-muted display-1"><i class="bi bi-inbox"></i></div>
                    <p class="h5 mt-3 text-muted">No items found matching your filters.</p>
                    <button class="btn btn-outline-success btn-sm mt-2" ng-click="resetFilters()">Reset All Filters</button>
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
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
    <link href="css/styles.css" rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
    <script src="app.js"></script>
</head>
<body ng-controller="AuthCtrl" class="auth-bg">
    
    <!-- Toast Container for Error Messages -->
    <div id="toast-container">
        <div class="custom-toast" ng-repeat="t in toasts" ng-class="t.type">
            <div class="toast-icon">
                <i class="bi" ng-class="{'bi-check-circle-fill': t.type=='success', 'bi-x-circle-fill': t.type=='error', 'bi-info-circle-fill': t.type=='info'}"></i>
            </div>
            <div class="fw-bold">{{t.message}}</div>
        </div>
    </div>

    <div class="auth-card">
        <div class="text-center mb-4">
            <h1 class="fw-bold text-success mb-0">Agrivendia</h1>
            <p class="text-muted">Welcome back to the market</p>
        </div>

        <!-- Form with Validation Name 'loginForm' -->
        <form name="loginForm" ng-submit="loginForm.$valid && loginCustomer()" novalidate>
            <!-- EMAIL FIELD -->
            <div class="mb-3">
                <label class="form-label small fw-bold text-uppercase text-muted">Email Address</label>
                <input type="email" 
                       name="email"
                       class="form-control" 
                       ng-model="loginData.email" 
                       ng-class="{'is-invalid': loginForm.email.$touched && loginForm.email.$invalid}"
                       required 
                       placeholder="name@example.com">
                <div class="invalid-feedback" ng-show="loginForm.email.$error.required">Email is required.</div>
                <div class="invalid-feedback" ng-show="loginForm.email.$error.email">Please enter a valid email address.</div>
            </div>

            <!-- PASSWORD FIELD WITH EYE ICON -->
            <div class="mb-4">
                <label class="form-label small fw-bold text-uppercase text-muted">Password</label>
                <div class="input-group has-validation">
                    <!-- Dynamic type: text vs password -->
                    <input type="{{ showPassword ? 'text' : 'password' }}" 
                           name="password"
                           class="form-control" 
                           ng-model="loginData.password" 
                           ng-class="{'is-invalid': loginForm.password.$touched && loginForm.password.$invalid}"
                           required 
                           placeholder="••••••••">
                    
                    <!-- Eye Icon Button -->
                    <button class="btn btn-outline-secondary" type="button" ng-click="togglePassword()">
                        <i class="bi" ng-class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                    </button>
                    
                    <div class="invalid-feedback" ng-show="loginForm.password.$error.required">
                        Password is required.
                    </div>
                </div>
                
                <div class="text-end mt-2">
                    <a href="forgot_password.html" class="small text-muted text-decoration-underline">Forgot password?</a>
                </div>
            </div>

            <!-- Submit disabled if form is invalid -->
            <button type="submit" class="btn-primary-custom w-100 py-3 rounded-pill shadow-lg" ng-disabled="loginForm.$invalid">Login Securely</button>
        </form>

        <div class="text-center mt-4 pt-3 border-top">
            <p class="text-muted small">Don't have an account?</p>
            <a href="register.html" class="btn btn-outline-custom btn-sm rounded-pill px-4">Create Account</a>
            <div class="mt-3">
                <a href="index.html" class="text-muted small"><i class="bi bi-arrow-left"></i> Back Home</a>
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
# Path: frontend/product_buy.html

<!DOCTYPE html>
<html lang="en" ng-app="userApp">
<head>
    <meta charset="UTF-8">
    <title>Request Product - Agrivendia</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
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
                
                <!-- ✅ EXPANDED UNIT SELECTION -->
                <div class="row g-3 mb-3">
                    <div class="col-md-4">
                        <label class="small fw-bold text-muted">Unit</label>
                        <select class="form-select" ng-model="product_buy.unit" required>
                            <option value="kg">Kg (Kilograms)</option>
                            <option value="ton">Ton (Metric Ton)</option>
                            <option value="quintal">Quintal</option>
                            <option value="box">Box</option>
                            <option value="crate">Crate</option>
                            <option value="dozen">Dozen</option>
                            <option value="piece">Piece</option>
                            <option value="l">Litres</option>
                            <option value="bag">Bag</option>
                        </select>
                    </div>
                    <div class="col-md-4"><label class="small fw-bold text-muted">Target Price</label><input type="number" class="form-control" ng-model="product_buy.price" min="1" required></div>
                    <div class="col-md-4"><label class="small fw-bold text-muted">Qty Needed</label><input type="number" class="form-control" ng-model="product_buy.quantity" min="1" required></div>
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

## File: frontend/profile.html
```html
# Path: frontend/profile.html
<!DOCTYPE html>
<html lang="en" ng-app="userApp">
<head>
    <meta charset="UTF-8">
    <title>My Profile - Agrivendia</title>
    <!-- CSS Dependencies -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
    <link href="css/styles.css" rel="stylesheet">
    
    <!-- JS Dependencies -->
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
    <script src="app.js"></script>
</head>
<body ng-controller="ProfileCtrl" class="bg-light">

    <!-- Toast Notifications -->
    <div id="toast-container">
        <div class="custom-toast" ng-repeat="t in toasts" ng-class="t.type">
            <div class="toast-icon">
                <i class="bi" ng-class="{'bi-check-circle-fill': t.type=='success', 'bi-x-circle-fill': t.type=='error'}"></i>
            </div>
            <div class="fw-bold">{{t.message}}</div>
        </div>
    </div>

    <!-- Navbar -->
    <div ng-include="'components/navbar.html'"></div>

    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
                    <div class="card-header bg-white border-0 p-4 pb-0">
                        <h4 class="fw-bold text-success mb-0">Edit Profile</h4>
                        <p class="text-muted small">Update your personal details.</p>
                    </div>
                    <div class="card-body p-5">
                        <form ng-submit="updateProfile()">
                            
                            <!-- Profile Picture Upload (Base64) -->
                            <div class="text-center mb-5">
                                <div class="position-relative d-inline-block">
                                    <!-- Displays New Image if selected, otherwise Current Image, otherwise Placeholder -->
                                    <img ng-src="{{ profile.newImage || getImageUrl(profile) || 'https://via.placeholder.com/150' }}" 
                                         class="rounded-circle shadow-sm border border-3" 
                                         style="width: 140px; height: 140px; object-fit: cover;">
                                    
                                    <!-- Camera Icon Button -->
                                    <label for="fileUpload" class="position-absolute bottom-0 end-0 bg-dark text-white rounded-circle p-2 shadow" style="cursor: pointer;">
                                        <i class="bi bi-camera-fill"></i>
                                    </label>
                                    
                                    <!-- Hidden Input for File Reader -->
                                    <input type="file" id="fileUpload" class="d-none" fileread="profile.newImage" accept="image/*">
                                </div>
                                <div class="small text-muted mt-2">Allowed: JPG, PNG (Max 2MB)</div>
                            </div>

                            <div class="row g-4">
                                <div class="col-md-6">
                                    <label class="form-label fw-bold small text-muted text-uppercase">Full Name</label>
                                    <input type="text" class="form-control" ng-model="profile.name" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label fw-bold small text-muted text-uppercase">Phone Number</label>
                                    <input type="text" class="form-control" ng-model="profile.phone" required>
                                </div>
                                <div class="col-12">
                                    <label class="form-label fw-bold small text-muted text-uppercase">Email Address</label>
                                    <!-- Readonly because changing email breaks login usually -->
                                    <input type="email" class="form-control bg-light text-muted" ng-model="profile.email" readonly disabled>
                                    <div class="form-text text-end"><i class="bi bi-lock-fill"></i> Email cannot be changed</div>
                                </div>
                                <div class="col-12">
                                    <label class="form-label fw-bold small text-muted text-uppercase">Address</label>
                                    <textarea class="form-control" rows="3" ng-model="profile.address" required></textarea>
                                </div>
                            </div>

                            <div class="mt-5 d-flex justify-content-between align-items-center">
                                <a href="customer_dashboard.html" class="text-muted text-decoration-none">Cancel</a>
                                <button type="submit" class="btn btn-primary-custom px-5 py-2 rounded-pill shadow-sm">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div ng-include="'components/footer.html'"></div>
    
    <!-- Bootstrap Bundle JS (Required for Navbar Dropdowns) -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
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
    <link href="css/styles.css" rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
    <script src="app.js"></script>
</head>
<body ng-controller="ProductDetailCtrl" style="background-color: #f8f9fa;">

    <div ng-include="'components/admin_navbar.html'"></div>

    <div class="container pb-5">
        <!-- PRODUCT CARD -->
        <div class="bg-white rounded-4 shadow-sm overflow-hidden mb-4">
            <div class="row g-0">
                <div class="col-md-6 bg-light d-flex align-items-center justify-content-center p-4">
                     <img ng-src="{{ getImageUrl(product) || 'https://via.placeholder.com/600' }}" class="img-fluid rounded-3 shadow-sm" style="max-height: 400px; width: 100%; object-fit: cover;">
                </div>
                <div class="col-md-6 p-5">
                    <div class="badge rounded-pill bg-success-subtle text-success mb-2 px-3 fw-bold">{{product.type === 'sell' ? 'FOR SALE' : 'WANTED'}}</div>
                    <h1 class="fw-bold mb-1">{{product.productName || product.buyerName}}</h1>
                    <h5 class="text-muted mb-3" ng-if="product.name && product.name != 'General'">{{product.name}}</h5>
                    
                    <div class="d-flex align-items-center mb-4">
                        <h2 class="text-success fw-bold m-0 me-3">₹ {{product.price}}</h2>
                        <!-- UNIT DISPLAY -->
                        <span class="text-muted fs-5">/ {{product.unit || 'kg'}}</span>
                    </div>

                    <div class="row g-3 mb-4">
                        <div class="col-6">
                            <div class="p-3 bg-light rounded-3 text-center">
                                <div class="small text-muted fw-bold">QUANTITY</div>
                                <div class="h5 fw-bold m-0">{{product.quantity}} {{product.unit || 'kg'}}</div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="p-3 bg-light rounded-3 text-center">
                                <div class="small text-muted fw-bold">LOCATION</div>
                                <div class="h5 fw-bold m-0">{{product.location}}</div>
                            </div>
                        </div>
                    </div>

                    <div class="mb-4">
                        <h6 class="fw-bold text-uppercase text-muted small">Description</h6>
                        <p class="text-secondary">{{product.description || 'No additional details provided.'}}</p>
                    </div>

                    <div class="d-flex align-items-center p-3 border rounded-3 bg-white">
                        <div class="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 45px; height: 45px;">
                            <i class="bi bi-person-fill"></i>
                        </div>
                        <div>
                            <div class="small text-muted fw-bold">POSTED BY</div>
                            <div class="fw-bold">{{product.sellerName || product.buyerName}}</div>
                        </div>
                        <div class="ms-auto" ng-if="isOwner">
                            <span class="badge bg-info text-dark">Your Post</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- BIDS SECTION -->
        <div class="row g-4">
            <!-- BID FORM -->
            <div class="col-md-5" ng-if="!isOwner">
                <div class="bg-white p-4 rounded-4 shadow-sm h-100">
                    <h4 class="fw-bold mb-3">Place an Offer</h4>
                    <form ng-submit="placeBid()">
                        <div class="form-floating mb-3">
                            <input type="number" class="form-control" id="qtyInput" ng-model="bid.quantity" placeholder="Quantity" required>
                            <label for="qtyInput">Quantity Needed ({{product.unit || 'kg'}})</label>
                        </div>
                        <div class="form-floating mb-3">
                            <input type="number" class="form-control" id="priceInput" ng-model="bid.amount" placeholder="Price" required>
                            <label for="priceInput">Your Price per {{product.unit || 'kg'}} (₹)</label>
                        </div>
                        <div class="form-floating mb-3">
                            <textarea class="form-control" id="msgInput" style="height: 100px" ng-model="bid.message" placeholder="Message"></textarea>
                            <label for="msgInput">Message (Optional)</label>
                        </div>
                        <button type="submit" class="btn btn-primary-custom w-100 py-3 rounded-pill">Submit Offer</button>
                    </form>
                </div>
            </div>

            <!-- BID LIST -->
            <div class="{{isOwner ? 'col-12' : 'col-md-7'}}">
                <div class="bg-white p-4 rounded-4 shadow-sm h-100">
                    <h4 class="fw-bold mb-4">Offer History <span class="badge bg-light text-dark rounded-pill">{{bids.length}}</span></h4>
                    
                    <div ng-if="bids.length == 0" class="text-center py-5 text-muted">
                        <i class="bi bi-chat-square-dots display-4 opacity-25"></i>
                        <p class="mt-2">No offers yet. Be the first!</p>
                    </div>

                    <div class="vstack gap-3">
                        <div ng-repeat="b in bids" class="p-3 border rounded-3 transition-hover" ng-class="{'border-success bg-success-subtle': b.status === 'ACCEPTED'}">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <div class="fw-bold">{{b.bidder_details.name}}</div>
                                    <div class="small text-muted">
                                        Wants <strong class="text-dark">{{b.quantity}} {{product.unit || 'kg'}}</strong> at <strong class="text-success fs-5">₹{{b.amount}}</strong>
                                    </div>
                                    <div class="mt-2 small bg-white p-2 rounded text-secondary border" ng-if="b.message">
                                        <i class="bi bi-chat-quote me-1"></i> {{b.message}}
                                    </div>
                                </div>
                                <div class="text-end">
                                    <span class="badge rounded-pill mb-2" ng-class="{'bg-warning text-dark': b.status=='PENDING', 'bg-success': b.status=='ACCEPTED', 'bg-danger': b.status=='REJECTED'}">{{b.status}}</span>
                                    
                                    <div ng-if="isOwner && b.status === 'PENDING'" class="d-flex gap-1 justify-content-end mt-1">
                                        <button class="btn btn-sm btn-success rounded-circle" ng-click="updateBidStatus(b, 'ACCEPTED')" title="Accept"><i class="bi bi-check-lg"></i></button>
                                        <button class="btn btn-sm btn-outline-danger rounded-circle" ng-click="updateBidStatus(b, 'REJECTED')" title="Reject"><i class="bi bi-x-lg"></i></button>
                                    </div>
                                </div>
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
<!-- Path: frontend/register.html -->
<!DOCTYPE html>
<html lang="en" ng-app="userApp">
<head>
    <meta charset="UTF-8">
    <title>Sign Up - Agrivendia</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
    <link href="css/styles.css" rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
    <script src="app.js"></script>
</head>
<body ng-controller="AuthCtrl" style="background: #f4f7f6;">
    
    <!-- TOAST CONTAINER -->
    <div id="toast-container">
        <div class="custom-toast" ng-repeat="t in toasts" ng-class="t.type">
            <div class="toast-icon">
                <i class="bi" ng-class="{'bi-check-circle-fill': t.type=='success', 'bi-x-circle-fill': t.type=='error', 'bi-info-circle-fill': t.type=='info'}"></i>
            </div>
            <div class="fw-bold">{{t.message}}</div>
        </div>
    </div>

    <div class="d-flex align-items-center justify-content-center" style="min-height:100vh;">
        <div class="reg-card bg-white shadow-sm rounded border p-5" style="max-width:500px; width:100%;">
            <h3 class="fw-bold text-success text-center mb-4">Create Account</h3>
            
            <form name="regForm" ng-submit="register()" novalidate>
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

                <!-- PASSWORD SECTION -->
                <div class="row mb-2">
                    <!-- Password Field -->
                    <div class="col-md-6">
                         <label class="small fw-bold text-muted">Password</label>
                         <div class="input-group">
                             <input type="{{ showPassword ? 'text' : 'password' }}" 
                                    class="form-control" 
                                    ng-model="regData.password" 
                                    ng-pattern="/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/" 
                                    required>
                             <button class="btn btn-outline-secondary" type="button" ng-click="togglePassword()">
                                <i class="bi" ng-class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                             </button>
                         </div>
                    </div>
                    
                    <!-- Confirm Field -->
                    <div class="col-md-6">
                         <label class="small fw-bold text-muted">Confirm</label>
                         <div class="input-group">
                             <input type="{{ showPassword ? 'text' : 'password' }}" 
                                    class="form-control" 
                                    ng-model="regData.confirm_password"
                                    ng-class="{'is-valid': regData.confirm_password && regData.password === regData.confirm_password, 'is-invalid': regData.confirm_password && regData.password !== regData.confirm_password}" 
                                    required>
                             <button class="btn btn-outline-secondary" type="button" ng-click="togglePassword()">
                                <i class="bi" ng-class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                             </button>
                         </div>
                    </div>
                </div>

                <!-- Match Status Message -->
                <div class="mb-2 text-center" ng-if="regData.confirm_password">
                    <small class="text-danger fw-bold" ng-if="regData.password !== regData.confirm_password">
                        <i class="bi bi-x-circle"></i> Passwords do not match
                    </small>
                    <small class="text-success fw-bold" ng-if="regData.password === regData.confirm_password && regData.password">
                        <i class="bi bi-check-circle"></i> Passwords match
                    </small>
                </div>
                
                <!-- DYNAMIC ERROR MESSAGE BLOCK -->
                <!-- Only shows if password exists AND there is at least one error -->
                <div class="alert alert-light border border-danger p-2 mb-4" 
                     ng-show="regData.password && (regData.password.length < 8 || !regData.password.match('[A-Z]') || !regData.password.match('[a-z]') || !regData.password.match('[0-9]'))">
                    
                    <small class="fw-bold text-danger d-block mb-1">Missing Requirements:</small>
                    
                    <!-- Line 1: Length -->
                    <div class="text-danger small" ng-show="regData.password.length < 8">
                        <i class="bi bi-dot"></i> Must be at least 8 characters
                    </div>
                    
                    <!-- Line 2: Case -->
                    <div class="text-danger small" ng-show="!regData.password.match('[A-Z]') || !regData.password.match('[a-z]')">
                        <i class="bi bi-dot"></i> Must have Uppercase & Lowercase
                    </div>
                    
                    <!-- Line 3: Number -->
                    <div class="text-danger small" ng-show="!regData.password.match('[0-9]')">
                        <i class="bi bi-dot"></i> Must contain a Number
                    </div>
                </div>

                <button type="submit" class="btn-success-custom w-100 rounded" ng-disabled="regForm.$invalid || regData.password !== regData.confirm_password">Register</button>
            </form>
            
            <div class="text-center mt-3 small">
                Already have an account? <a href="login.html" class="text-success fw-bold">Login</a>
            </div>
            <div class="text-center mt-3 pt-3 border-top">
                <a href="index.html" class="text-secondary small text-decoration-none"><i class="bi bi-arrow-left"></i> Back to Home</a>
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
```

---

## File: frontend/index.html
```html
# Path: frontend/index.html
<!DOCTYPE html>
<html lang="en" ng-app="userApp">
<head>
    <meta charset="UTF-8">
    <title>Agrivendia - Fresh Farm Market</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
    <link href="css/styles.css" rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
    <script src="app.js"></script>
    <style>
        /* Modern Card Styling - No Badge */
        .card-hover {
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            border-radius: 12px;
            overflow: hidden;
            background: #fff;
            border: 1px solid rgba(0,0,0,0.08);
        }
        .card-hover:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important;
        }
        .prod-img-wrap {
            height: 220px;
            position: relative;
            background: #fdfdfd;
        }
        .prod-img-wrap img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .search-overlap {
            margin-top: -40px;
            position: relative;
            z-index: 10;
        }
        .text-success-custom {
            color: #2E7D32;
        }
    </style>
</head>
<body ng-controller="MarketplaceCtrl">

    <div ng-include="'components/navbar.html'" ng-init="activePage='home'"></div>

    <div id="heroCarousel" class="carousel slide carousel-fade hero-wrapper" data-bs-ride="carousel">
        <div class="carousel-indicators">
            <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" class="active"></button>
            <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1"></button>
        </div>
        <div class="carousel-inner">
            <div class="carousel-item active">
                <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1932" class="d-block w-100" alt="Farm">
                <div class="carousel-caption d-none d-md-block text-start">
                    <h1 class="display-3 fw-bold">Cultivating Trust</h1>
                    <p class="fs-4">Direct marketplace connecting farmers and buyers.</p>
                </div>
            </div>
            <div class="carousel-item">
                <img src="https://images.unsplash.com/photo-1605000797499-95a05f526b72?q=80&w=1932" class="d-block w-100" alt="Tractor">
                <div class="carousel-caption d-none d-md-block text-start">
                    <h1 class="display-3 fw-bold">Fair & Transparent</h1>
                    <p class="fs-4">Get the best price for your hard work.</p>
                </div>
            </div>
        </div>
    </div>

    <div class="container search-overlap">
        <form class="search-box mx-auto" style="max-width: 800px;" ng-submit="goToMarket()">
            <i class="bi bi-search text-muted ms-3 fs-5"></i>
            <input type="text" class="search-input" ng-model="searchText" placeholder="Search for onions, wheat, apples...">
            <button type="submit" class="search-btn">Find Products</button>
        </form>
    </div>

    <div class="container py-5 mt-3">
        
        <div ng-repeat="section in homeSections" ng-if="section.items.length > 0" class="mb-5">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 class="fw-bold mb-0 text-dark">{{section.title}}</h3>
                    <p class="text-muted small m-0">Freshly harvested by local farmers</p>
                </div>
                <a href="market.html?cat={{section.title}}" class="btn btn-outline-success rounded-pill px-4 btn-sm fw-bold">View All</a>
            </div>

            <div class="row g-4">
                <div class="col-lg-3 col-md-4 col-sm-6" ng-repeat="p in section.items | limitTo:4">
                    <div class="card-hover h-100 shadow-sm" ng-click="openProduct(p)" style="cursor: pointer;">
                        <div class="prod-img-wrap">
                             <img ng-if="getImageUrl(p)" ng-src="{{getImageUrl(p)}}" alt="{{p.productName}}">
                             <div ng-if="!getImageUrl(p)" class="d-flex align-items-center justify-content-center h-100 text-muted bg-light">
                                <i class="bi bi-image fs-1 opacity-25"></i>
                             </div>
                        </div>
                        
                        <div class="p-3">
                            <div class="fw-bold fs-5 text-dark text-truncate mb-1">{{p.productName}}</div>
                            <div class="text-muted small mb-3">
                                <i class="bi bi-geo-alt-fill text-danger me-1"></i> {{p.location}}
                            </div>
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="text-success-custom fw-bold fs-4">₹{{p.price}}</div>
                                <span class="badge bg-light text-dark border fw-normal">{{p.quantity}} Units</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="text-center py-5" ng-if="homeSections.length === 0">
            <div class="spinner-border text-success" role="status"></div>
            <p class="mt-3 text-muted fw-bold">Loading Marketplace...</p>
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
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
    <link href="css/styles.css" rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
    <script src="app.js"></script>
</head>
<body ng-controller="PlanCtrl">
    <div ng-include="'components/navbar.html'" ng-init="activePage='plan'"></div>

    <div class="container py-5">
        <div class="text-center mb-5">
            <h1 class="fw-bold">Choose Your Growth Plan</h1>
            <p class="text-muted">Scale your business with our tailored memberships</p>
        </div>

        <div class="row g-4 justify-content-center">
            
            <!-- FREE PLAN -->
            <div class="col-xl-3 col-md-6">
                <div class="card h-100 border-0 shadow-sm p-4 text-center">
                    <h4 class="fw-bold text-secondary">Free Starter</h4>
                    <div class="display-4 fw-bold text-dark my-3">₹0</div>
                    <p class="text-muted">Lifetime Access</p>
                    <hr>
                    <ul class="list-unstyled text-start mb-4 mx-auto" style="max-width: 200px;">
                        <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i> <strong>3</strong> Listings Limit</li>
                        <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i> Basic Support</li>
                        <li class="mb-2"><i class="bi bi-x-circle-fill text-muted me-2"></i> No Verified Badge</li>
                    </ul>
                    <button class="btn btn-outline-secondary w-100 rounded-pill" disabled>Default Plan</button>
                </div>
            </div>

            <!-- GROWER BASIC -->
            <div class="col-xl-3 col-md-6">
                <div class="card h-100 border-success shadow p-4 text-center position-relative overflow-hidden">
                    <div class="bg-success text-white position-absolute top-0 start-0 w-100 py-1 small fw-bold">POPULAR</div>
                    <h4 class="fw-bold text-success mt-3">Grower Basic</h4>
                    <div class="display-4 fw-bold text-success my-3">₹199</div>
                    <p class="text-muted">Per Month</p>
                    <hr>
                    <ul class="list-unstyled text-start mb-4 mx-auto" style="max-width: 200px;">
                        <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i> <strong>10</strong> Listings Limit</li>
                        <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i> Priority Visibility</li>
                        <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i> Verified Badge</li>
                    </ul>
                    <button class="btn btn-success w-100 rounded-pill" ng-click="buyPlan(2, 'Grower Basic')">Buy Now</button>
                </div>
            </div>

            <!-- TRADER PRO -->
            <div class="col-xl-3 col-md-6">
                <div class="card h-100 border-0 shadow-sm p-4 text-center">
                    <h4 class="fw-bold text-primary">Trader Pro</h4>
                    <div class="display-4 fw-bold text-dark my-3">₹999</div>
                    <p class="text-muted">6 Months</p>
                    <hr>
                    <ul class="list-unstyled text-start mb-4 mx-auto" style="max-width: 200px;">
                        <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i> <strong>Unlimited</strong> Listings</li>
                        <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i> Top Search Rank</li>
                        <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i> Dedicated Manager</li>
                    </ul>
                    <button class="btn btn-outline-primary w-100 rounded-pill" ng-click="buyPlan(3, 'Trader Pro')">Buy Now</button>
                </div>
            </div>

            <!-- ENTERPRISE -->
            <div class="col-xl-3 col-md-6">
                <div class="card h-100 border-0 bg-dark text-white shadow p-4 text-center">
                    <h4 class="fw-bold text-warning">Enterprise</h4>
                    <div class="display-6 fw-bold text-white my-3">Custom</div>
                    <p class="text-white-50">Yearly Contracts</p>
                    <hr class="border-secondary">
                    <ul class="list-unstyled text-start mb-4 mx-auto" style="max-width: 200px;">
                        <li class="mb-2"><i class="bi bi-check-circle-fill text-warning me-2"></i> <strong>Custom</strong> Limits</li>
                        <li class="mb-2"><i class="bi bi-check-circle-fill text-warning me-2"></i> API Access</li>
                        <li class="mb-2"><i class="bi bi-check-circle-fill text-warning me-2"></i> Direct Owner Support</li>
                    </ul>
                    <a href="mailto:sales@agrivendia.com?subject=Enterprise Inquiry" class="btn btn-warning w-100 rounded-pill fw-bold">Contact Sales</a>
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
                
                <!-- ✅ EXPANDED UNIT SELECTION -->
                <div class="row g-3 mb-3">
                    <div class="col-md-4">
                        <label class="small fw-bold text-muted">Unit</label>
                        <select class="form-select" ng-model="product_sell.unit" required>
                            <option value="kg">Kg (Kilograms)</option>
                            <option value="ton">Ton (Metric Ton)</option>
                            <option value="quintal">Quintal (100kg)</option>
                            <option value="g">Grams</option>
                            <option value="l">Litres</option>
                            <option value="ml">Millilitres</option>
                            <option value="box">Box</option>
                            <option value="crate">Crate</option>
                            <option value="dozen">Dozen</option>
                            <option value="piece">Piece</option>
                            <option value="bag">Bag/Sack</option>
                            <option value="barrel">Barrel</option>
                            <option value="bunch">Bunch</option>
                        </select>
                    </div>
                    <div class="col-md-4">
                         <label class="small fw-bold text-muted">Price / Unit (₹)</label>
                         <input type="number" class="form-control" ng-model="product_sell.price" min="1" required>
                    </div>
                    <div class="col-md-4">
                         <label class="small fw-bold text-muted">Quantity</label>
                         <input type="number" class="form-control" ng-model="product_sell.quantity" min="1" required>
                    </div>
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
/* Path: frontend/css/styles.css */

/* ===============================
   GOOGLE FONT
================================ */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

/* ===============================
   ROOT VARIABLES
================================ */
:root {
    --primary: #2E7D32;
    --primary-dark: #1B5E20;
    --primary-light: #E8F5E9;
    --accent: #FF9800;
    --dark: #2c3e50;
    --light: #f8f9fa;
    --text-muted: #6c757d;

    --shadow-sm: 0 2px 8px rgba(0,0,0,0.05);
    --shadow-md: 0 8px 24px rgba(0,0,0,0.08);
    --shadow-lg: 0 15px 35px rgba(0,0,0,0.1);

    --radius: 16px;
}

/* ===============================
   GLOBAL
================================ */
body {
    font-family: 'Poppins', sans-serif;
    background-color: #f4f7f6;
    color: var(--dark);
    -webkit-font-smoothing: antialiased;
}

a {
    text-decoration: none;
    transition: 0.3s;
}

/* ===============================
   NAVBAR
================================ */
.navbar {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    box-shadow: var(--shadow-sm);
    padding: 15px 0;
}

.navbar-brand {
    font-weight: 800;
    color: var(--primary) !important;
    font-size: 1.6rem;
}

.nav-link {
    font-weight: 500;
    color: #555;
    margin: 0 8px;
    font-size: 0.95rem;
    position: relative;
}

.nav-link:hover,
.nav-link.active-link {
    color: var(--primary) !important;
}

.nav-link.active-link::after {
    content: '';
    position: absolute;
    width: 6px;
    height: 6px;
    background: var(--primary);
    border-radius: 50%;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
}

.btn-nav-login {
    color: var(--primary);
    font-weight: 600;
    padding: 8px 20px;
    border-radius: 50px;
}

.btn-nav-signup {
    background: var(--primary);
    color: #fff;
    font-weight: 600;
    padding: 8px 25px;
    border-radius: 50px;
    box-shadow: 0 4px 15px rgba(46,125,50,0.3);
}

.btn-nav-signup:hover {
    background: var(--primary-dark);
    transform: translateY(-2px);
}

/* ===============================
   HERO / LANDING
================================ */
.hero-wrapper {
    position: relative;
    border-radius: 0 0 30px 30px;
    overflow: hidden;
    box-shadow: var(--shadow-md);
}

.carousel-item {
    height: 500px;
}

.carousel-item img {
    object-fit: cover;
    height: 100%;
    filter: brightness(0.6);
}

.carousel-caption {
    bottom: 35%;
}

.carousel-caption h1 {
    font-size: 4rem;
    font-weight: 800;
    text-shadow: 0 4px 20px rgba(0,0,0,0.5);
}

/* Floating Search */
.search-overlap {
    margin-top: -35px;
    position: relative;
    z-index: 10;
    padding: 0 15px;
}

.search-box {
    background: white;
    padding: 10px;
    border-radius: 50px;
    box-shadow: var(--shadow-lg);
    max-width: 750px;
    margin: auto;
    display: flex;
    align-items: center;
}

.search-input {
    border: none;
    flex-grow: 1;
    padding: 15px 25px;
    font-size: 1.1rem;
    outline: none;
}

.search-btn {
    background: var(--primary);
    color: white;
    border: none;
    padding: 12px 35px;
    border-radius: 40px;
    font-weight: 600;
}

.search-btn:hover {
    background: var(--primary-dark);
    transform: scale(1.05);
}

/* ===============================
   CARDS / PRODUCTS
================================ */
.card-hover {
    background: white;
    border-radius: var(--radius);
    box-shadow: var(--shadow-sm);
    transition: 0.3s;
    overflow: hidden;
    height: 100%;
}

.card-hover:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-lg);
}

.prod-img-wrap {
    height: 220px;
    background: #f1f1f1;
    overflow: hidden;
}

.prod-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: 0.5s;
}

.card-hover:hover img {
    transform: scale(1.1);
}

.badge-float {
    position: absolute;
    top: 15px;
    right: 15px;
    background: rgba(255,255,255,0.9);
    padding: 6px 14px;
    border-radius: 30px;
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--primary);
}

.prod-body {
    padding: 20px;
}

.prod-title {
    font-weight: 700;
    font-size: 1.15rem;
}

.prod-price {
    color: var(--primary);
    font-size: 1.3rem;
    font-weight: 800;
}

.prod-loc {
    font-size: 0.9rem;
    color: var(--text-muted);
}

/* ===============================
   BUTTONS
================================ */
.btn-primary-custom {
    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
    border: none;
    color: white;
    padding: 12px 25px;
    border-radius: 10px;
    font-weight: 600;
    box-shadow: 0 4px 15px rgba(46,125,50,0.3);
}

.btn-primary-custom:hover {
    transform: translateY(-2px);
}

.btn-outline-custom {
    border: 2px solid #e0e0e0;
    padding: 10px 20px;
    border-radius: 10px;
    font-weight: 600;
}

.btn-outline-custom:hover {
    border-color: var(--primary);
    color: var(--primary);
    background: var(--primary-light);
}

/* ===============================
   FORMS
================================ */
.form-control,
.form-select {
    border: 1px solid #e0e0e0;
    background: #fbfbfb;
    padding: 14px 20px;
    border-radius: 12px;
}

.form-control:focus,
.form-select:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 4px rgba(46,125,50,0.1);
}

/* ===============================
   AUTH (LOGIN / SIGNUP)
================================ */
.auth-bg {
    background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.auth-card {
    background: white;
    padding: 40px;
    border-radius: 24px;
    box-shadow: var(--shadow-lg);
    max-width: 450px;
    width: 100%;
}

/* ===============================
   TOAST NOTIFICATIONS
================================ */
#toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
}

.custom-toast {
    min-width: 300px;
    background: white;
    border-left: 5px solid #333;
    padding: 15px 20px;
    margin-bottom: 15px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.15);
    animation: slideIn 0.3s ease-out forwards;
    display: flex;
    align-items: center;
}

.custom-toast.success { border-left-color: #2E7D32; }
.custom-toast.error { border-left-color: #d32f2f; }
.custom-toast.info { border-left-color: #0288d1; }

.toast-icon {
    font-size: 1.5rem;
    margin-right: 15px;
}

@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

/* ===============================
   FORM VALIDATION
================================ */
.validation-reqs {
    font-size: 0.8rem;
    color: #6c757d;
    background: #f8f9fa;
    padding: 10px;
    border-radius: 8px;
}

.valid-check { color: #2E7D32; }
.invalid-check { color: #e0e0e0; }

/* ===============================
   FOOTER
================================ */
footer {
    background: #1a1f24;
    color: #aeb5bc;
    padding: 60px 0 30px;
    margin-top: 60px;
}

.footer-title {
    color: white;
    font-weight: 700;
}

.social-icon {
    width: 40px;
    height: 40px;
    background: rgba(255,255,255,0.1);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: white;
    margin-right: 10px;
}

.social-icon:hover {
    background: var(--primary);
    transform: translateY(-3px);
}

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
        <!-- Logo / Brand -->
        <a class="navbar-brand d-flex align-items-center" href="index.html">
            Agrivendia
        </a>

        <!-- Mobile Toggle Button -->
        <button class="navbar-toggler border-0 shadow-none" type="button"
                data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <i class="bi bi-list fs-1 text-dark"></i>
        </button>

        <!-- Navbar Links -->
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
                <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
                <li class="nav-item"><a class="nav-link" href="market.html">Marketplace</a></li>
                <li class="nav-item"><a class="nav-link" href="category.html">Categories</a></li>
                <li class="nav-item"><a class="nav-link" href="plan.html">Plans</a></li>
                <li class="nav-item"><a class="nav-link" href="about.html">About</a></li>
            </ul>

            <div class="d-flex align-items-center gap-2">
                
                <!-- ✅ LOGGED IN VIEW (User Dropdown) -->
                <div ng-if="currentUser" class="dropdown">
                    <a class="nav-link dropdown-toggle fw-bold text-dark d-flex align-items-center"
                       href="#" data-bs-toggle="dropdown" aria-expanded="false">

                        <!-- User Avatar -->
                        <div class="me-2 d-flex align-items-center justify-content-center rounded-circle overflow-hidden"
                             style="width: 35px; height: 35px; background: #e8f5e9;">
                            <img ng-if="getImageUrl(currentUser)"
                                 ng-src="{{getImageUrl(currentUser)}}"
                                 style="width:100%; height:100%; object-fit:cover;">
                            <span ng-if="!getImageUrl(currentUser)" class="text-success fw-bold">
                                {{currentUser.name.charAt(0)}}
                            </span>
                        </div>
                        {{currentUser.name}}
                    </a>

                    <!-- DROPDOWN MENU -->
                    <ul class="dropdown-menu dropdown-menu-end shadow border-0 rounded-4 mt-2 p-2">
                        
                        <!-- 1. Dashboard Link -->
                        <li>
                            <a class="dropdown-item rounded-3 mb-1" href="customer_dashboard.html">
                                <i class="bi bi-grid-fill me-2 text-primary"></i> Dashboard
                            </a>
                        </li>

                        <!-- 2. My Profile Link (ADDED HERE) -->
                        <li>
                            <a class="dropdown-item rounded-3 mb-1" href="profile.html">
                                <i class="bi bi-person-fill me-2 text-success"></i> My Profile
                            </a>
                        </li>

                        <li><hr class="dropdown-divider"></li>
                        
                        <!-- 3. Logout Link -->
                        <li>
                            <a class="dropdown-item rounded-3 text-danger" href="#" ng-click="logout()">
                                <i class="bi bi-box-arrow-right me-2"></i> Logout
                            </a>
                        </li>
                    </ul>
                </div>

                <!-- ❌ LOGGED OUT VIEW -->
                <div ng-if="!currentUser" class="d-flex gap-2">
                    <a href="login.html" class="btn btn-outline-custom border-0 rounded-pill px-3">Login</a>
                    <a href="register.html" class="btn btn-primary-custom rounded-pill px-4 py-2 small">Sign Up</a>
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
<nav class="navbar mb-4 bg-white border-bottom shadow-none py-3">
    <div class="container">
        <a class="navbar-brand fw-bold text-dark d-flex align-items-center" href="index.html">
            <i class="bi bi-flower1 text-success me-2"></i> Agrivendia
        </a>
        <a href="javascript:history.back()" class="btn btn-light rounded-pill px-3 fw-bold text-muted small hover-shadow">
            <i class="bi bi-arrow-left me-1"></i> Back
        </a>
    </div>
</nav>
```

---

## File: backend/utils.py
```python
# Path: backend/utils.py
# Path: backend/utils.py
from django.core.mail import send_mail

def notify_user(email, subject, message):
    """
    Centralized email notification handler.
    Call this function from any view/serializer.
    """
    # Log to console for MVP/Debugging
    print(f"\n[EMAIL SIMULATION] To: {email} | Subject: {subject} | Body: {message}\n")
    
    # Actual Email Sending Logic (Uncomment when SMTP is configured in settings.py)
    # try:
    #     send_mail(
    #         subject, 
    #         message, 
    #         'admin@agrivendia.com', # Sender
    #         [email],                # Recipient List
    #         fail_silently=True
    #     )
    # except Exception as e:
    #     print(f"Error sending email: {e}")
```

---

## File: backend/populate_data.py
```python
# Path: backend/populate_data.py
import os
import django
import random

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
    ProductBid.objects.all().delete()
    ProductSell.objects.all().delete()
    ProductBuy.objects.all().delete()
    Product.objects.all().delete()
    Category.objects.all().delete()
    Customer.objects.all().delete()
    User.objects.all().delete()
    Plan.objects.all().delete()
    
    print("🌱 Populating Database...")

    # --- 1. CATEGORIES ---
    print("   [1/9] Creating Categories...")
    cats_data = {
        "Vegetables": "Fresh, organic, and locally grown vegetables.",
        "Fruits": "Premium quality sweet fruits.",
        "Grains": "Rice, Wheat, Maize, and Millets.",
        "Spices": "Authentic aromatic spices.",
        "Commercial": "Cotton, Sugarcane, Jute, and Coffee.",
        "Dairy": "Fresh Milk, Ghee, Paneer, and Curd.",
        "Others": "Miscellaneous items and custom products."
    }
    
    cat_objects = {}
    for name, desc in cats_data.items():
        c = Category.objects.create(name=name, description=desc)
        cat_objects[name] = c

    # --- 2. PLANS ---
    print("   [2/9] Creating Plans...")
    plans_data = [
        ("Free Starter", "Lifetime", "0"),
        ("Grower Basic", "1 Month", "199"),
        ("Trader Pro", "6 Months", "999"),
        ("Enterprise", "1 Year", "4999"),
    ]
    for name, dur, price in plans_data:
        Plan.objects.create(name=name, duration=dur, price=price)

    # --- 3. ADMIN USERS ---
    print("   [3/9] Creating Admins...")
    User.objects.create(name="Super Admin", email="admin@agri.com", phone="9999999999", password="admin")

    # --- 4. CUSTOMERS ---
    print("   [4/9] Creating Customers...")
    customer_names = [
        "Ramesh Patil", "Suresh Kumar", "Anita Desai", "Farm Fresh Ltd", "Organic Basket",
        "John Doe", "Rahul Dravid", "Big Basket Sourcing", "Reliance Fresh", "Kisan Mandi",
        "Vijay Singh", "Priya Sharma", "Green Earth Agro", "Mahesh Babu", "Local Traders"
    ]
    
    customers = []
    for i, name in enumerate(customer_names):
        c = Customer.objects.create(
            name=name,
            email=f"user{i+1}@example.com",
            phone=f"98{random.randint(10000000, 99999999)}",
            address=f"Plot No {i+1}, Agri Zone, India",
            password="123" 
        )
        customers.append(c)

    # --- 5. PRODUCTS ---
    print("   [5/9] Creating Master Products...")
    product_catalog = [
        ("Red Onion", "Vegetables", "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600"),
        ("Potato (Jyoti)", "Vegetables", "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600"),
        ("Tomato (Hybrid)", "Vegetables", "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600"),
        ("Kashmir Apple", "Fruits", "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600"),
        ("Alphonso Mango", "Fruits", "https://images.unsplash.com/photo-1553279768-865429fa0078?w=600"),
        ("Basmati Rice", "Grains", "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600"),
        ("Wheat (Sharbati)", "Grains", "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600"),
        ("Raw Cotton", "Commercial", "https://images.unsplash.com/photo-1606132039201-98782a20b227?w=600"),
        ("Other / Custom", "Others", "https://via.placeholder.com/150")
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

    locations = ["Nashik", "Pune", "Mumbai", "Nagpur", "Bangalore", "Delhi", "Gujarat"]

    # --- 6. SELL LISTINGS ---
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
            image=None 
            # Note: Removed sellerName and phoneNo as they are now FKs
        )
        sell_posts.append(sp)

    # --- 7. BUY REQUESTS ---
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
            price=round(random.uniform(15.0, 4000.0), 2), 
            quantity=random.randint(100, 10000),
            location=loc,
            image=None
            # Note: Removed buyerName
        )
        buy_posts.append(bp)

    # --- 8. BIDS ---
    print("   [8/9] Creating Bids...")
    for i in range(20):
        is_sell_bid = random.choice([True, False])
        bidder = random.choice(customers)
        status_choice = random.choice(['PENDING', 'ACCEPTED', 'PENDING', 'REJECTED'])
        
        if is_sell_bid:
            post = random.choice(sell_posts)
            while post.customer == bidder: bidder = random.choice(customers)
            
            ProductBid.objects.create(
                bidder=bidder,
                sell_post=post,
                amount=post.price * 0.95, 
                quantity=random.randint(10, post.quantity),
                message="Can you arrange transport?",
                status=status_choice
            )
        else:
            post = random.choice(buy_posts)
            while post.customer == bidder: bidder = random.choice(customers)
                
            ProductBid.objects.create(
                bidder=bidder,
                buy_post=post,
                amount=post.price * 1.05, 
                quantity=post.quantity,
                message="I have this stock ready.",
                status=status_choice
            )

    print("\n✅ Database Successfully Populated!")

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

ALLOWED_HOSTS = ['agrivendia.loca.lt','fresh-clouds-call.loca.lt','127.0.0.1','localhost']


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

CORS_ALLOW_METHODS = ["GET","POST","PUT","DELETE","OPTIONS"]

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
import base64
import uuid
from django.core.files.base import ContentFile

# Helper for Image Upload
class Base64ImageField(serializers.Field):
    def to_internal_value(self, data):
        if isinstance(data, str) and data.startswith('data:image'):
            try:
                format, imgstr = data.split(';base64,') 
                ext = format.split('/')[-1] 
                id = uuid.uuid4()
                data = ContentFile(base64.b64decode(imgstr), name=f"{id}.{ext}")
            except:
                raise serializers.ValidationError("Invalid image format")
        return data

    def to_representation(self, value):
        if not value: return None
        try: return value.url
        except: return None

class CustomerSerializer(serializers.ModelSerializer):
    profile_image = Base64ImageField(required=False, allow_null=True)

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
from .views import CustomerAPI, LoginAPI, ForgotPasswordLinkAPI, ResetPasswordAPI

urlpatterns = [
    path('', CustomerAPI.as_view()),                 
    path('<int:id>/', CustomerAPI.as_view()),        
    path('login/', LoginAPI.as_view()), 
    path('forgot-password/', ForgotPasswordLinkAPI.as_view()), # Generates Link
    path('reset-password/', ResetPasswordAPI.as_view()),       # Validates Token & Resets
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
from .models import Customer, PasswordResetToken
from .serializer import CustomerSerializer
import requests
import os
import re
from django.utils import timezone

TELEGRAM_BOT_TOKEN = os.environ.get("TLGRMTKN")

# =====================================================
# 1️⃣ LOGIN API
# =====================================================
class LoginAPI(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response(
                {"error": "Email and password are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            customer = Customer.objects.get(email=email)
            if customer.password == password:
                serializer = CustomerSerializer(customer)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(
                    {"error": "Incorrect Password"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Customer.DoesNotExist:
            return Response(
                {"error": "Email not found"},
                status=status.HTTP_404_NOT_FOUND
            )


# =====================================================
# 2️⃣ CUSTOMER CRUD (With Strong Password Validation)
# =====================================================
class CustomerAPI(APIView):

    # CREATE
    def post(self, request):
        password = request.data.get('password')

        # 🔐 Password strength regex
        password_regex = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"

        if password and not re.match(password_regex, password):
            return Response(
                {
                    "error": (
                        "Password too weak. "
                        "Must contain at least 8 characters, "
                        "one uppercase, one lowercase, one number, "
                        "and one special character."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = CustomerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # READ
    def get(self, request, id=None):
        if id:
            try:
                customer = Customer.objects.get(id=id)
                serializer = CustomerSerializer(customer)
                return Response(serializer.data)
            except Customer.DoesNotExist:
                return Response(
                    {"error": "Customer not found"},
                    status=status.HTTP_404_NOT_FOUND
                )

        customers = Customer.objects.all()
        serializer = CustomerSerializer(customers, many=True)
        return Response(serializer.data)

    # UPDATE (Partial update enabled)
    def put(self, request, id):
        try:
            customer = Customer.objects.get(id=id)
        except Customer.DoesNotExist:
            return Response(
                {"error": "Customer not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = CustomerSerializer(
            customer,
            data=request.data,
            partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DELETE
    def delete(self, request, id):
        try:
            customer = Customer.objects.get(id=id)
            customer.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Customer.DoesNotExist:
            return Response(
                {"error": "Customer not found"},
                status=status.HTTP_404_NOT_FOUND
            )


# =====================================================
# 3️⃣ FORGOT PASSWORD (SEND TELEGRAM LINK)
# =====================================================
class ForgotPasswordLinkAPI(APIView):
    def post(self, request):
        if not TELEGRAM_BOT_TOKEN:
            return Response(
                {"error": "Server Config Error: Telegram Token Missing"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        email = request.data.get('email')
        chat_id = request.data.get('chat_id')

        if not email or not chat_id:
            return Response(
                {"error": "Email and Chat ID are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            customer = Customer.objects.get(email=email)
        except Customer.DoesNotExist:
            return Response(
                {"error": "Email not registered"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Create reset token
        reset_obj = PasswordResetToken.objects.create(
            user_email=email
        )

        # Frontend reset link
        reset_link = (
            "http://127.0.0.1:5500/frontend/reset_password.html"
            f"?token={reset_obj.token}"
        )

        # Telegram message
        message = (
            "🔑 *Agrivendia Password Reset*\n\n"
            f"Hello {customer.name},\n\n"
            "Click the link below to reset your password:\n"
            f"{reset_link}\n\n"
            "_This link expires in 30 minutes_"
        )

        telegram_url = (
            f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
        )

        data = {
            "chat_id": chat_id,
            "text": message,
            "parse_mode": "Markdown"
        }

        try:
            requests.post(telegram_url, data=data)
            return Response(
                {"message": "Password reset link sent to Telegram"},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# =====================================================
# 4️⃣ RESET PASSWORD (VERIFY TOKEN & UPDATE)
# =====================================================
class ResetPasswordAPI(APIView):
    def post(self, request):
        token = request.data.get('token')
        new_password = request.data.get('new_password')

        if not token or not new_password:
            return Response(
                {"error": "Token and new password are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            reset_obj = PasswordResetToken.objects.get(token=token)

            # ⏰ Check expiry (30 minutes)
            time_diff = timezone.now() - reset_obj.created_at
            if time_diff.total_seconds() > 1800:
                reset_obj.delete()
                return Response(
                    {"error": "Reset link expired"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Update password
            customer = Customer.objects.get(
                email=reset_obj.user_email
            )
            customer.password = new_password
            customer.save()

            # Delete token after use
            reset_obj.delete()

            return Response(
                {"message": "Password updated successfully"},
                status=status.HTTP_200_OK
            )

        except PasswordResetToken.DoesNotExist:
            return Response(
                {"error": "Invalid token"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Customer.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )

```

---

## File: backend/customer/models.py
```python
# Path: backend/customer/models.py
from django.db import models
import uuid

class Customer(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    address = models.TextField(blank=True)
    password = models.CharField(max_length=100)
    # NEW FIELD
    profile_image = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    # NEW: Track Plan Level (1=Free, 2=Grower, 3=Trader, 4=Enterprise)
    plan_tier = models.IntegerField(default=1) 
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class PasswordResetToken(models.Model):
    user_email = models.EmailField()
    token = models.UUIDField(default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user_email} - {self.token}"
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
# Path: backend/user/views.py
import csv
import io
import os
import random
import requests
from django.apps import apps
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import User
from .serializer import UserSerializer

# Models for Bulk Upload Lookups
from category.models import Category
from customer.models import Customer
from product.models import Product

# Storage for User (Admin) OTPs (In-memory)
USER_OTP_STORAGE = {} 
TELEGRAM_BOT_TOKEN = os.environ.get("TLGRMTKN")

# --- HELPER FUNCTIONS (DRY Principle) ---
def get_user_or_error(user_id):
    """
    Helper to fetch user or return standard 404 response.
    Returns: (user_object, error_response)
    """
    try:
        return User.objects.get(id=user_id), None
    except User.DoesNotExist:
        return None, Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)

def validate_otp(phone, otp):
    """
    Helper to validate OTP against storage.
    """
    if phone in USER_OTP_STORAGE and str(USER_OTP_STORAGE[phone]) == str(otp):
        return True
    return False

# --- VIEWS ---

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


class VerifyUserOTP(APIView):
    def post(self, request):
        phone = request.data.get('phone')
        otp = request.data.get('otp')
        
        if validate_otp(phone, otp):
            return Response({"message": "Verified"}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)


class ResetUserPassword(APIView):
    def post(self, request):
        phone = request.data.get('phone')
        otp = request.data.get('otp')
        new_password = request.data.get('new_password')

        if validate_otp(phone, otp):
            User.objects.filter(phone=phone).update(password=new_password)
            del USER_OTP_STORAGE[phone] # Clean up used OTP
            return Response({"message": "User Password Updated"}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)


class UserAPI(APIView):
    def get(self, request, id=None):
        if id:
            user, error_res = get_user_or_error(id)
            if error_res: return error_res
            
            serializer = UserSerializer(user)
            return Response(serializer.data)
        
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, id):
        user, error_res = get_user_or_error(id)
        if error_res: return error_res
            
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        user, error_res = get_user_or_error(id)
        if error_res: return error_res

        user.delete()
        return Response({"message": "Deleted"}, status=status.HTTP_204_NO_CONTENT)


class BulkUploadAPI(APIView):
    def post(self, request, model_name):
        file = request.FILES.get('file')
        if not file:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Decode File
        try:
            decoded_file = file.read().decode('utf-8')
            io_string = io.StringIO(decoded_file)
            reader = csv.DictReader(io_string)
        except Exception as e:
            return Response({"error": f"CSV Read Error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        
        success_count = 0
        errors = []
        
        # 2. Map URL slug to actual Model Class
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
                # Copy row to avoid modifying original CSV reader dict if needed
                data = dict(row)
                
                # --- LOGIC 1: PRODUCT UPLOAD (Map Category Name -> FK) ---
                if model_name == 'product':
                    if 'category' in data and data['category']:
                        cat_name = data.pop('category')
                        cat_obj = Category.objects.filter(name__iexact=cat_name.strip()).first()
                        if not cat_obj:
                            raise Exception(f"Category '{cat_name}' not found. Create it first.")
                        data['category'] = cat_obj 
                    # If category is missing in CSV, product is created with category=None

                # --- LOGIC 2: SELL/BUY POSTS (Map Strings -> FKs) ---
                if model_name in ['product_sell', 'product_buy']:
                    
                    # A. Resolve Product (Name -> ID)
                    if 'product' in data:
                        prod_name = data.pop('product') # Remove string field
                        prod_obj = Product.objects.filter(productName__iexact=prod_name.strip()).first()
                        if not prod_obj:
                            raise Exception(f"Product '{prod_name}' not found.")
                        data['product'] = prod_obj
                        # Auto-link Category from the Product
                        data['category'] = prod_obj.category

                    # B. Resolve Customer (Email -> ID)
                    # Use 'seller_email' for Sells, 'buyer_email' for Buys in CSV
                    email_key = 'seller_email' if model_name == 'product_sell' else 'buyer_email'
                    
                    if email_key in data:
                        email = data.pop(email_key) # Remove email string
                        cust_obj = Customer.objects.filter(email=email.strip()).first()
                        if not cust_obj:
                            raise Exception(f"Customer with email '{email}' not found.")
                        data['customer'] = cust_obj
                    else:
                        raise Exception(f"CSV missing '{email_key}' column")

                # 3. Create Database Record
                ModelClass.objects.create(**data)
                success_count += 1

            except Exception as e:
                errors.append(f"Row {row_num}: {str(e)}")
            
            row_num += 1

        return Response({
            "message": f"Processed {row_num-1} rows. Success: {success_count}.",
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
# Path: backend/product_bid/serializer.py
from rest_framework import serializers
from .models import ProductBid
from customer.serializer import CustomerSerializer

class ProductBidSerializer(serializers.ModelSerializer):
    # Nested serializer to show bidder name in frontend easily
    bidder_details = CustomerSerializer(source='bidder', read_only=True)
    
    # Custom field to get the Post Owner's details (for the bidder to see)
    post_owner_details = serializers.SerializerMethodField()

    class Meta:
        model = ProductBid
        fields = '__all__'
    
    def get_post_owner_details(self, obj):
        # If this bid is on a Sell Post, return Seller's info
        if obj.sell_post and obj.sell_post.customer:
            return {
                "name": obj.sell_post.customer.name,
                "phone": obj.sell_post.customer.phone
            }
        # If this bid is on a Buy Post, return Buyer's info
        elif obj.buy_post and obj.buy_post.customer:
            return {
                "name": obj.buy_post.customer.name,
                "phone": obj.buy_post.customer.phone
            }
        return None
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
# Path: backend/product_bid/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from .models import ProductBid
from .serializer import ProductBidSerializer

# IMPORT CENTRALIZED EMAIL UTILITY
from utils import notify_user 

class ProductBidAPI(APIView):
    
    def get(self, request, id=None):
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
        
        # Validation: Check if Bid Quantity <= Available Quantity
        if serializer.is_valid():
            # Check availability logic before saving
            data = serializer.validated_data
            available_qty = 0
            
            if data.get('sell_post'):
                available_qty = data['sell_post'].quantity
            elif data.get('buy_post'):
                available_qty = data['buy_post'].quantity
                
            if data['quantity'] > available_qty:
                 return Response(
                     {"error": f"Bid quantity ({data['quantity']}) exceeds available stock ({available_qty})"}, 
                     status=status.HTTP_400_BAD_REQUEST
                 )

            serializer.save()
            
            # Notify Post Owner (Using Utility)
            post_owner = data['sell_post'].customer if data.get('sell_post') else data['buy_post'].customer
            notify_user(post_owner.email, "New Bid Received", f"You have a new bid of {data['amount']}")
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, id):
        try:
            bid = ProductBid.objects.get(id=id)
        except ProductBid.DoesNotExist:
            return Response({"error": "Bid not found"}, status=status.HTTP_404_NOT_FOUND)

        status_update = request.data.get('status')
        if not status_update:
            return Response({"error": "Only status updates allowed"}, status=status.HTTP_400_BAD_REQUEST)

        # ---------------------------------------------------------
        # CORE BUSINESS LOGIC: ACCEPTANCE & INVENTORY DEDUCTION
        # ---------------------------------------------------------
        if status_update == 'ACCEPTED':
            try:
                with transaction.atomic():
                    # 1. Select Post for Update (Lock the row to prevent Race Conditions)
                    if bid.sell_post:
                        post = bid.sell_post.__class__.objects.select_for_update().get(id=bid.sell_post.id)
                        related_bids = ProductBid.objects.filter(sell_post=post, status='PENDING').exclude(id=bid.id)
                    elif bid.buy_post:
                        post = bid.buy_post.__class__.objects.select_for_update().get(id=bid.buy_post.id)
                        related_bids = ProductBid.objects.filter(buy_post=post, status='PENDING').exclude(id=bid.id)
                    else:
                        raise Exception("Bid is not linked to any post")

                    # 2. Critical Check: Is Quantity still sufficient?
                    if post.quantity < bid.quantity:
                        # Auto-invalidate this bid if stock is gone
                        bid.status = 'INVALID'
                        bid.save()
                        return Response(
                            {"error": "Insufficient Quantity. Stock changed before you accepted."}, 
                            status=status.HTTP_409_CONFLICT
                        )

                    # 3. Deduct Inventory
                    post.quantity -= bid.quantity
                    post.save()

                    # 4. Accept Bid
                    bid.status = 'ACCEPTED'
                    bid.save()

                    # 5. Notify Bidder (Using Utility)
                    notify_user(bid.bidder.email, "Bid Accepted!", 
                                f"Your bid was accepted. Contact {post.customer.phone} to finalize.")

                    # 6. Check "Invalid Bid" State for OTHER bids
                    for other_bid in related_bids:
                        if other_bid.quantity > post.quantity:
                            other_bid.status = 'INVALID'
                            other_bid.save()
                            notify_user(other_bid.bidder.email, "Bid Invalidated", 
                                        "The post quantity dropped below your requested amount.")

                    serializer = ProductBidSerializer(bid)
                    return Response(serializer.data)

            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # ---------------------------------------------------------
        # LOGIC: REJECT OR OTHER STATUS
        # ---------------------------------------------------------
        else:
            bid.status = status_update
            bid.save()
            if status_update == 'REJECTED':
                notify_user(bid.bidder.email, "Bid Rejected", "Your bid was rejected by the owner.")
            
            serializer = ProductBidSerializer(bid)
            return Response(serializer.data)
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
        ('INVALID', 'Invalid'), 
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

    # Fetch dynamically from Customer FK
    buyerName = serializers.ReadOnlyField(source='customer.name')

    image = Base64ImageField(required=False, allow_null=True)

    class Meta:
        model = ProductBuy
        fields = '__all__'
        read_only_fields = ['created_at']
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
# Path: backend/product_buy/views.py
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ProductBuy
from .serializer import ProductBuySerializer
from customer.models import Customer

class ProductBuyAPI(APIView):
    
    def validate_ownership(self, product_buy, request_data):
        requester_id = request_data.get('customer') or self.request.query_params.get('customer')
        if not requester_id: return False
        return str(product_buy.customer.id) == str(requester_id)

    def post(self, request):
        serializer = ProductBuySerializer(data=request.data)
        if serializer.is_valid():
            try:
                customer_id = request.data.get('customer')
                current_customer = Customer.objects.get(id=customer_id)
                serializer.save(customer=current_customer)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Customer.DoesNotExist:
                 return Response({"error": "Customer not found"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, id=None):
        if id:
            try:
                productBuy = ProductBuy.objects.get(id=id)
            except ProductBuy.DoesNotExist:
                return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)
            serializer = ProductBuySerializer(productBuy)
            return Response(serializer.data)

        productsBuy = ProductBuy.objects.all()
        
        # FIXED: Filter by direct category_id, not product__category_id
        # This ensures General Requests (where product is Null) are included
        category_id = request.query_params.get('category_id')
        if category_id: productsBuy = productsBuy.filter(category_id=category_id)

        customer_id = request.query_params.get('customer_id')
        if customer_id: productsBuy = productsBuy.filter(customer_id=customer_id)
            
        serializer = ProductBuySerializer(productsBuy, many=True)
        return Response(serializer.data)
    
    def put(self, request, id):
        try:
            productBuy = ProductBuy.objects.get(id=id)
        except ProductBuy.DoesNotExist:
            return Response({"error":"Not Found"}, status=status.HTTP_404_NOT_FOUND)
        
        if not self.validate_ownership(productBuy, request.data):
             return Response({"error": "Permission Denied"}, status=status.HTTP_403_FORBIDDEN)

        serializer = ProductBuySerializer(productBuy, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        try:
            productBuy = ProductBuy.objects.get(id=id)
        except ProductBuy.DoesNotExist:
            return Response({"error":"Not Found"}, status=status.HTTP_404_NOT_FOUND)
        
        if not self.validate_ownership(productBuy, request.query_params):
             return Response({"error": "Permission Denied"}, status=status.HTTP_403_FORBIDDEN)

        productBuy.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
```

---

## File: backend/product_buy/models.py
```python
# Path: backend/product_buy/models.py
from django.db import models
from category.models import Category
from customer.models import Customer
from product.models import Product

class ProductBuy(models.Model):
    UNIT_CHOICES = (
        ('kg', 'Kilograms (kg)'),
        ('ton', 'Metric Tons'),
        ('quintal', 'Quintals'),
        ('g', 'Grams'),
        ('lb', 'Pounds'),
        ('l', 'Litres'),
        ('ml', 'Millilitres'),
        ('box', 'Boxes'),
        ('crate', 'Crates'),
        ('dozen', 'Dozens'),
        ('piece', 'Pieces/Numbers'),
        ('barrel', 'Barrels'),
        ('bag', 'Bags/Sacks'),
        ('bunch', 'Bunches')
    )
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='buy_posts')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='buy_listings', null=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='buy_products')
    
    image = models.FileField(upload_to='buy_uploads/', blank=True, null=True)
    name = models.CharField(max_length=50, blank=True, null=True, default="General")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    location = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField()
    unit = models.CharField(max_length=10, choices=UNIT_CHOICES, default='kg')
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Buy: {self.name} - {self.customer.name}"
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
from rest_framework import serializers
from .models import ProductSell
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
                raise serializers.ValidationError("Invalid image format")
        return data

    def to_representation(self, value):
        if not value: return None
        try: return value.url
        except: return None

class ProductSellSerializer(serializers.ModelSerializer):
    # Fetch from Master Product Table
    productName = serializers.ReadOnlyField(source='product.productName')
    productImage = serializers.ReadOnlyField(source='product.productImage')
    
    # Fetch from Customer Table (Dynamic)
    sellerName = serializers.ReadOnlyField(source='customer.name')
    phoneNo = serializers.ReadOnlyField(source='customer.phone')
    
    image = Base64ImageField(required=False, allow_null=True)

    class Meta:
        model = ProductSell
        fields = '__all__'
        read_only_fields = ['created_at'] 

    def validate_price(self, value):
        if value <= 0: raise serializers.ValidationError('Price must be positive')
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
# Path: backend/product_sell/views.py
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ProductSell
from .serializer import ProductSellSerializer
from customer.models import Customer

class ProductSellAPI(APIView):
    
    # --- OWNERSHIP HELPER ---
    def validate_ownership(self, product_sell, request_data):
        requester_id = request_data.get('customer') or self.request.query_params.get('customer')
        if not requester_id:
             return False
        return str(product_sell.customer.id) == str(requester_id)

    def post(self, request):
        serializer = ProductSellSerializer(data=request.data)
        if serializer.is_valid():
            try:
                customer_id = request.data.get('customer')
                current_customer = Customer.objects.get(id=customer_id)
                
                # ---------------------------------------------------------
                # ✅ UPDATED SUBSCRIPTION LOGIC
                # ---------------------------------------------------------
                # Tier 1 = Free (3 Posts)
                # Tier 2 = Grower Basic (10 Posts)
                # Tier 3 = Trader Pro (Unlimited/1000)
                # Tier 4 = Enterprise (Unlimited)
                
                tier = current_customer.plan_tier
                limit = 3  # Default / Free
                
                if tier == 2: limit = 10
                elif tier == 3: limit = 1000
                elif tier == 4: limit = 999999 

                # Count *active* sell posts (where quantity > 0)
                # This allows them to delete old posts to free up slots if they don't want to upgrade
                current_count = ProductSell.objects.filter(customer=current_customer, quantity__gt=0).count()
                
                if current_count >= limit:
                    # Message guides them to the next step
                    msg = f"Plan Limit Reached ({limit} active posts)."
                    if tier < 3:
                        msg += " Upgrade your plan to post more."
                    else:
                        msg += " Contact Enterprise Sales for custom limits."

                    return Response(
                        {"error": msg}, 
                        status=status.HTTP_402_PAYMENT_REQUIRED
                    )
                # ---------------------------------------------------------

                serializer.save(customer=current_customer)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Customer.DoesNotExist:
                return Response({"error": "Customer not found"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
        if customer_id: productsSell = productsSell.filter(customer_id=customer_id)

        category_id = request.query_params.get('category_id')
        if category_id: productsSell = productsSell.filter(product__category_id=category_id)
        
        serializer = ProductSellSerializer(productsSell, many=True)
        return Response(serializer.data)

    def put(self, request, id):
        try:
            productSell = ProductSell.objects.get(id=id)
        except ProductSell.DoesNotExist:
            return Response({"error":"Not Found"}, status=status.HTTP_404_NOT_FOUND)
            
        if not self.validate_ownership(productSell, request.data):
             return Response({"error": "Permission Denied"}, status=status.HTTP_403_FORBIDDEN)

        serializer = ProductSellSerializer(productSell, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        try:
            productSell = ProductSell.objects.get(id=id)
        except ProductSell.DoesNotExist:
            return Response({"error":"Not Found"}, status=status.HTTP_404_NOT_FOUND)

        if not self.validate_ownership(productSell, request.data):
             return Response({"error": "Permission Denied"}, status=status.HTTP_403_FORBIDDEN)

        productSell.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
```

---

## File: backend/product_sell/models.py
```python
# Path: backend/product_sell/models.py
from django.db import models
from category.models import Category
from customer.models import Customer
from product.models import Product  

class ProductSell(models.Model):
    UNIT_CHOICES = (
        ('kg', 'Kilograms (kg)'),
        ('ton', 'Metric Tons'),
        ('quintal', 'Quintals'),
        ('g', 'Grams'),
        ('lb', 'Pounds'),
        ('l', 'Litres'),
        ('ml', 'Millilitres'),
        ('box', 'Boxes'),
        ('crate', 'Crates'),
        ('dozen', 'Dozens'),
        ('piece', 'Pieces/Numbers'),
        ('barrel', 'Barrels'),
        ('bag', 'Bags/Sacks'),
        ('bunch', 'Bunches')
    )

    # Foreign Keys serve as the Source of Truth
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='sell_posts')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='sell_listings', null=True) 
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='sell_products', null=True, blank=True)
    
    image = models.FileField(upload_to='sell_uploads/', blank=True, null=True)
    name = models.CharField(max_length=50, blank=True, null=True, default="General")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    location = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField()
    description = models.CharField(max_length=500)
    unit = models.CharField(max_length=10, choices=UNIT_CHOICES, default='kg')
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.customer.name}"
```

---

## File: backend/product_sell/tests.py
```python
# Path: backend/product_sell/tests.py
from django.test import TestCase

# Create your tests here.

```

---

