"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220707175155 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220707175155 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table "card" add column "sentence_arr" text[] not null;');
    }
    async down() {
        this.addSql('alter table "card" drop column "sentence_arr";');
    }
}
exports.Migration20220707175155 = Migration20220707175155;
//# sourceMappingURL=Migration20220707175155.js.map