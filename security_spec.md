# Security Specification - Terracotta Eatery

This specification details the Attribute-Based Access Control and Zero-Trust validation architecture for Terracotta Eatery.

## 1. Data Invariants
- **Reservations**: Customers can create reservations with automatic status `pending`. Table capacity is strictly capped at `50` guests. Existing reservations cannot be deleted by clients.
- **Orders**: Only valid lists of items can be ordered. Initial state must be `pending`. 
- **PII Integrity**: Listing all orders and reservations is globally blocked. Reads must be targeted to a single document ID (the receipt or confirmation token).

## 2. The "Dirty Dozen" Threat Vectors
1. **Creation of Reservation without a Name**: Blocked by string validation size bounds.
2. **Excessive Guest Numbers (Denial of Table)**: Guests count > 50 must be rejected.
3. **Premature Confirmation**: Attempting to create an order or reservation with preset status `confirmed` or `completed` bypassed to skip payment/verification.
4. **Mass Scraping**: Client executing a query to list all reservations in Cape Town.
5. **PII Poisoning**: Injecting 1MB junk data into the `phone` field.
6. **Order Ghost Field Injection**: Including a `isFreeProduct: true` shadow key in the document.
7. **Reservation Deletion**: Attackers deleting others' reservation slots.
8. **Negative Order Pricing**: Creating a takeaway order with a negative total price.
9. **Order Hijacking (Status Skipping)**: Directly editing the items of an already placed order during fulfillment.
10. **ID Hijacking (ID Poisoning)**: Sending non-standard strings or scripts as reservation document IDs.
11. **Order Emptiness**: Placing an order with an empty items list.
12. **Tampering with Immutable History**: Changing customer name on an already placed order.

## 3. Test Cases (TDD Blueprint)

```typescript
// Blueprint for firestore.rules verification:
// All "Dirty Dozen" payloads will return PERMISSION_DENIED.
```
