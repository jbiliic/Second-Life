### Project Info

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Status](https://img.shields.io/badge/status-MVP-orange)
![License](https://img.shields.io/badge/license-proprietary-lightgrey)

### Tech Stack

![Backend](https://img.shields.io/badge/backend-NestJS-red)
![Database](https://img.shields.io/badge/database-PostgreSQL-blue)
![ORM](https://img.shields.io/badge/ORM-Prisma-2D3748)

![Frontend](https://img.shields.io/badge/frontend-React-61DAFB)
![Build Tool](https://img.shields.io/badge/bundler-Vite-646CFF)
![Language](https://img.shields.io/badge/language-TypeScript-3178C6)

### Focus

![Focus](https://img.shields.io/badge/focus-circular%20economy-brightgreen)
![Sustainability](https://img.shields.io/badge/sustainability-ESG-success)

---

# SecondLife ♻️

**SecondLife. First Choice.**

SecondLife is a B2B marketplace platform that connects companies with surplus packaging materials and those who need them. The goal is to reduce waste, optimize costs, and enable seamless participation in the circular economy.

## 🌐 Live Demo

The deployed application is available here:

[Open SecondLife Demo](https://second-life-1.onrender.com/)

## 🎨 Prototype

You can explore the interactive platform prototype on Figma:

[View Figma Prototype](https://www.figma.com/proto/oQSPmS52f2XWlN2kulSXJB/SecondLife?node-id=251-6440&p=f&t=wHDA7TUF0B452Hno-1&scaling=scale-down&content-scaling=fixed&page-id=169%3A4968&starting-point-node-id=251%3A6440&show-proto-sidebar=1)

## 🚀 Problem

- Large companies regularly generate surplus packaging that ends up as waste
- They incur significant disposal costs
- Small businesses purchase new packaging at full price
- There is no centralized platform connecting these two sides

## 💡 Solution

SecondLife enables:

- Selling surplus packaging instead of disposing of it
- Buying packaging at lower cost
- Simple and transparent B2B transaction flow
- Digitalization of material circulation

## 🧩 Key Features

- 📦 Create and browse packaging listings
- 🔍 Search by material type and location
- 🤝 B2B order management
- 🚚 Pickup coordination
- 📊 Track activity through orders

## 🏗️ Tech Stack

**Backend**

- NestJS
- PostgreSQL
- Prisma
- JWT Authentication

**Frontend**

- React
- Vite
- TypeScript

## 📡 API Overview

### Auth

- `POST /auth/register` - Company registration
- `GET /auth/verify` - Verify company email address
- `POST /auth/login` - Login (JWT)
- `POST /auth/reset-password` - Send password reset email
- `GET /auth/confirm-reset-password` - Validate password reset token and redirect user
- `GET /auth/validate` - Validate and refresh JWT token

### Companies

- `GET /companies/me` - Profile
- `PUT /companies/me` - Update profile
- `POST /companies/locations` - Add a new company location
- `GET /companies/locations` - Get all company locations
- `POST /companies/payment-methods` - Add a new payment method
- `GET /companies/payment-methods` - Get all company payment methods
- `PATCH /companies/me/logo` - Upload or update company logo
- `GET /companies/stats/co2-saved` - Get total CO2 saved
- `GET /companies/stats/active-listings` - Get active listings
- `PUT /companies/stats/profit-last-30-days` - Get company profit from the last 30 days

### Listings

- `GET /listings` - List (filters: material_type, min_price, max_price, condition, etc.)
- `GET /listings/home-page` - Get listings for the home page
- `GET /listings/my` - Get authenticated company listings
- `GET /listings/:id` - Get listing details
- `POST /listings` - Create a new listing
- `PUT /listings/:id` - Update listing (owner only)
- `DELETE /listings/:id` - Delete listing (owner only)

### Orders

- `POST /orders` - Create order
- `GET /orders/my` - My orders
- `GET /orders/:id` - Details
- `PATCH /orders/:id/status` - Update status

### Pickup

- `GET /listings/:id/pickup-slots` - Available slots
- `POST /listings/:id/pickup-slots` - Create slot

## 🗄️ Database Structure (high-level)

Core entities:

- **Company:** Business users (buyers and sellers)
- **Listing:** Packaging surplus offers
- **Order:** Transactions between companies
- **Location:** Physical addresses

Supporting entities:

- **ListingImage:** Images for listings
- **Rating:** Post-transaction reviews
- **SavedListing:** Saved/favorited listings
- **Alert:** User-defined search alerts
- **Notification:** System notifications
- **PickupSlot:** Available pickup times
- **RecurringSchedule:** Repeating listings
- **CompanyPaymentMethod:** Payment details for companies

## 📈 Business Model

- 5% transaction fee
- Premium subscription (advanced features & analytics)
- Future monetization via logistics and ESG reporting

## 🌍 Vision

SecondLife aims to become the standard platform for packaging circulation in the region, enabling companies to easily track and demonstrate their environmental impact.

## 📄 License

Copyright (c) 2026 SecondLife. All rights reserved.
This project is proprietary and not licensed for public use, copying, modification, or distribution.

## 📬 Contact

For questions and collaboration:
**SecondLife Team**

- **Development:** [Josip Bilić](mailto:pripravnik-josip.bilic@dump.hr), [Duje Nikolić Malora](mailto:pripravnik-duje.nikolic.malora@dump.hr)
- **Design:** [Lea Purtić](mailto:pripravnik-lea.purtic@dump.hr)
- **Multimedia, Team Lead:** [Ana Kelava](mailto:pripravnik-ana.kelava@dump.hr)
- **Mentor:** [Damjana Barić](mailto:damjana.baric@dump.hr)
