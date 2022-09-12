import bcrypt from "bcryptjs";

const users = [
    {
        name: "Admin User",
        email: "admin@example.com",
        password: bcrypt.hashSync("123456", 10),
        isAdmin: true,
    },
    {
        name: "Customer 1",
        email: "john@example.com",
        password: bcrypt.hashSync("1234578", 10),
    },
    {
        name: "Customer 2",
        email: "jane@example.com",
        password: bcrypt.hashSync("123456", 10),
    },
];

export default users;
