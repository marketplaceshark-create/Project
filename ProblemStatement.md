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