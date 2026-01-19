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