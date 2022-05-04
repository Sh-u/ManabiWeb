"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220424142227 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220424142227 extends migrations_1.Migration {
    async up() {
        this.addSql('create table "post" ("_id" serial primary key, "title" text not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
    }
    async down() {
        this.addSql('drop table if exists "post" cascade;');
    }
}
exports.Migration20220424142227 = Migration20220424142227;
//# sourceMappingURL=Migration20220424142227.js.map