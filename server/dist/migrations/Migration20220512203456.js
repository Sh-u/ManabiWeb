"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220512203456 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220512203456 extends migrations_1.Migration {
    async up() {
        this.addSql('create table "deck" ("_id" serial primary key, "title" text not null, "author__id" int not null, "posts" text[] null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
        this.addSql('alter table "deck" add constraint "deck_author__id_foreign" foreign key ("author__id") references "user" ("_id") on update cascade;');
    }
    async down() {
        this.addSql('drop table if exists "deck" cascade;');
    }
}
exports.Migration20220512203456 = Migration20220512203456;
//# sourceMappingURL=Migration20220512203456.js.map