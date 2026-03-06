# Checkout Flow Web App

A clean, responsive, multi-step checkout flow built with React, Next.js (App Router), Tailwind CSS, and the Context API.

## 🚀 Features

- **Store Mock Data via SSR**: The initial cart is fetched using Server-Side Rendering (SSR) via Next.js Server Components.
- **Global State Management**: Context API is used to manage the state (cart items, address, calculations) across multiple steps without prop-drilling.
- **Form Validation**: The Address form includes standard validations (required fields, valid email, 10-digit phone, numeric PIN code).
- **Clean Architecture & UI**: Divided into modular components. Uses Tailwind CSS for a modern, mobile-friendly interface inspired by top ecommerce sites. Includes a simulated 1-second payment delay.
- **Lucide React Icons**: To provide premium vector icons for the progress indicator and status messages.

## 📁 Folder Structure

```
/app
  /checkout
    page.tsx            # Initial cart screen (SSR Component)
    /address/page.tsx   # Address form screen
    /payment/page.tsx   # Order confirmation and payment simulation screen
    /success/page.tsx   # Final success confirmation screen
  /api/cart/route.ts    # Mock backend API delivering JSON data
/components
  AddressForm.tsx       # Controlled form component with validations
  CartItem.tsx          # Presentation of a single cart item
  CartScreen.tsx        # Client side initialization component taking SSR props
  CheckoutLayout.tsx    # Layout wrapper containing StepIndicator
  OrderSummary.tsx      # Computed calculations and summary block
  StepIndicator.tsx     # Progress bar outlining user checkout journey
/context
  CheckoutContext.tsx   # Core global state context managing the entire flow
/lib
  calculations.ts       # Centralized business logic (Subtotal, Grand Total)
/types
  index.ts              # Global TypeScript interfaces
```

## 🛠️ How to Run Locally

### 1. Prerequisites
Ensure you have Node.js and npm installed on your machine.

### 2. Install Dependencies
Run the following command at the root of the project to install Next.js, React, Tailwind, and Lucide Icons.

```bash
npm install
```

### 3. Run the Development Server
Start the Next.js App Router local server:

```bash
npm run dev
```

### 4. Experience the app
Navigate to [http://localhost:3000/checkout](http://localhost:3000/checkout) in your browser to test the full checkout flow. 
- You will see the cart items securely fetched via a mocked asynchronous network call on the server.
- Fill out the address details and confirm payment to reach the success page!
