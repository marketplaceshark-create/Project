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