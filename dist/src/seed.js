"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const user_service_1 = require("./services/user.service");
const bill_service_1 = require("./services/bill.service");
async function seed() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const userService = app.get(user_service_1.UserService);
    const billService = app.get(bill_service_1.BillService);
    const sequelize = app.get("SEQUELIZE");
    console.log("🌱 Starting to seed the database...");
    try {
        console.log("🔄 Synchronizing database tables...");
        const forceSync = process.env.FORCE_SYNC === "true";
        if (forceSync) {
            console.log("⚠️  FORCE_SYNC=true: Dropping and recreating all tables...");
            await sequelize.sync({ force: true });
        }
        else {
            console.log("🔧 Creating tables if they don't exist...");
            await sequelize.sync({ alter: true });
        }
        console.log("✅ Database tables synchronized successfully!");
        console.log("📝 Creating seed data...");
        const user1 = await userService.create({
            firstName: "Alice",
            lastName: "Johnson",
            email: "alice@example.com",
            creditCardNumber: "**** **** **** 1234",
        });
        const user2 = await userService.create({
            firstName: "Bob",
            lastName: "Smith",
            email: "bob@example.com",
            creditCardNumber: "**** **** **** 5678",
        });
        console.log("✅ Created users:", user1.firstName, user2.firstName);
        const aliceBills = [
            {
                userId: user1.id,
                amount: 150.0,
                dueDate: new Date("2024-01-15"),
                description: "January Credit Card Bill",
            },
            {
                userId: user1.id,
                amount: 225.5,
                dueDate: new Date("2024-02-15"),
                description: "February Credit Card Bill",
            },
            {
                userId: user1.id,
                amount: 189.75,
                dueDate: new Date("2024-03-15"),
                description: "March Credit Card Bill",
            },
            {
                userId: user1.id,
                amount: 267.25,
                dueDate: new Date("2024-04-15"),
                description: "April Credit Card Bill (Unpaid)",
            },
        ];
        const bobBills = [
            {
                userId: user2.id,
                amount: 89.99,
                dueDate: new Date("2024-01-15"),
                description: "January Credit Card Bill",
            },
            {
                userId: user2.id,
                amount: 156.78,
                dueDate: new Date("2024-02-15"),
                description: "February Credit Card Bill",
            },
            {
                userId: user2.id,
                amount: 203.45,
                dueDate: new Date("2024-03-15"),
                description: "March Credit Card Bill (Unpaid)",
            },
        ];
        const createdBills = [];
        for (const billData of [...aliceBills, ...bobBills]) {
            const bill = await billService.create(billData);
            createdBills.push(bill);
        }
        console.log("✅ Created", createdBills.length, "bills");
        console.log("💳 Paying Alice's bills on time...");
        await billService.payBill(createdBills[0].id, {
            paidDate: new Date("2024-01-10"),
        });
        await billService.payBill(createdBills[1].id, {
            paidDate: new Date("2024-02-12"),
        });
        const result = await billService.payBill(createdBills[2].id, {
            paidDate: new Date("2024-03-14"),
        });
        if (result.reward) {
            console.log("🎉 Alice earned a reward:", result.reward.description);
        }
        await billService.payBill(createdBills[4].id, {
            paidDate: new Date("2024-01-12"),
        });
        await billService.payBill(createdBills[5].id, {
            paidDate: new Date("2024-02-20"),
        });
        console.log("✅ Seed data created successfully!");
        console.log("");
        console.log("📊 Summary:");
        console.log("- Alice: 3 on-time payments (should have earned a reward)");
        console.log("- Bob: 1 on-time, 1 late payment (no reward)");
        console.log("");
        console.log("🚀 You can now test the API endpoints!");
    }
    catch (error) {
        console.error("❌ Error seeding database:", error);
    }
    finally {
        await app.close();
    }
}
seed();
//# sourceMappingURL=seed.js.map