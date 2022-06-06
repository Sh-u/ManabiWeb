"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220606141544 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220606141544 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table "deck" drop constraint "deck_author__id_foreign";');
        this.addSql('alter table "deck" rename column "author__id" to "user__id";');
        this.addSql('alter table "deck" add constraint "deck_user__id_foreign" foreign key ("user__id") references "user" ("_id") on update cascade;');
    }
    async down() {
        this.addSql('alter table "deck" drop constraint "deck_user__id_foreign";');
        this.addSql('alter table "deck" rename column "user__id" to "author__id";');
        this.addSql('alter table "deck" add constraint "deck_author__id_foreign" foreign key ("author__id") references "user" ("_id") on update cascade;');
    }
}
exports.Migration20220606141544 = Migration20220606141544;
//# sourceMappingURL=Migration20220606141544.js.map