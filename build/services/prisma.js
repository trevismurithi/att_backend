"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = exports.prisma = void 0;
const client_1 = require("@prisma/client");
Object.defineProperty(exports, "Role", { enumerable: true, get: function () { return client_1.Role; } });
const prisma = new client_1.PrismaClient();
exports.prisma = prisma;
