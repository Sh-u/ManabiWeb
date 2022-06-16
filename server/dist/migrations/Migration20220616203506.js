"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220616203506 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220616203506 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table "user" add column "image" text null;');
    }
    async down() {
        this.addSql('alter table "user" drop column "image";');
    }
}
exports.Migration20220616203506 = Migration20220616203506;
//# sourceMappingURL=Migration20220616203506.js.map