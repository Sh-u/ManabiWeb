"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220523170856 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220523170856 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table "post" add column "image" text null, add column "audio" text null;');
    }
    async down() {
        this.addSql('alter table "post" drop column "image";');
        this.addSql('alter table "post" drop column "audio";');
    }
}
exports.Migration20220523170856 = Migration20220523170856;
//# sourceMappingURL=Migration20220523170856.js.map