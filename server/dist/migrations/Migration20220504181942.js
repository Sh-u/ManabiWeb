"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220504181942 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220504181942 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table "user" add column "email" text not null;');
        this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
    }
    async down() {
        this.addSql('alter table "user" drop constraint "user_email_unique";');
        this.addSql('alter table "user" drop column "email";');
    }
}
exports.Migration20220504181942 = Migration20220504181942;
//# sourceMappingURL=Migration20220504181942.js.map