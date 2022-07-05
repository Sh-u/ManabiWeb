"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220705191457 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220705191457 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table "follow" drop constraint "follow_following_id_foreign";');
        this.addSql('alter table "follow" drop constraint "follow_pkey";');
        this.addSql('alter table "follow" rename column "following_id" to "followed_user__id";');
        this.addSql('alter table "follow" add constraint "follow_followed_user__id_foreign" foreign key ("followed_user__id") references "user" ("_id") on update cascade on delete cascade;');
        this.addSql('alter table "follow" add constraint "follow_pkey" primary key ("followed_user__id", "user__id");');
    }
    async down() {
        this.addSql('alter table "follow" drop constraint "follow_followed_user__id_foreign";');
        this.addSql('alter table "follow" drop constraint "follow_pkey";');
        this.addSql('alter table "follow" rename column "followed_user__id" to "following_id";');
        this.addSql('alter table "follow" add constraint "follow_following_id_foreign" foreign key ("following_id") references "user" ("_id") on update cascade on delete cascade;');
        this.addSql('alter table "follow" add constraint "follow_pkey" primary key ("following_id", "user__id");');
    }
}
exports.Migration20220705191457 = Migration20220705191457;
//# sourceMappingURL=Migration20220705191457.js.map