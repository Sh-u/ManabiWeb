"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220705190727 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220705190727 extends migrations_1.Migration {
    async up() {
        this.addSql('create table "follow" ("following_id" int not null, "user__id" int not null);');
        this.addSql('alter table "follow" add constraint "follow_pkey" primary key ("following_id", "user__id");');
        this.addSql('alter table "follow" add constraint "follow_following_id_foreign" foreign key ("following_id") references "user" ("_id") on update cascade on delete cascade;');
        this.addSql('alter table "follow" add constraint "follow_user__id_foreign" foreign key ("user__id") references "user" ("_id") on update cascade on delete cascade;');
        this.addSql('drop table if exists "user_following" cascade;');
    }
    async down() {
        this.addSql('create table "user_following" ("user_1__id" int not null, "user_2__id" int not null);');
        this.addSql('alter table "user_following" add constraint "user_following_pkey" primary key ("user_1__id", "user_2__id");');
        this.addSql('alter table "user_following" add constraint "user_following_user_1__id_foreign" foreign key ("user_1__id") references "user" ("_id") on update cascade on delete cascade;');
        this.addSql('alter table "user_following" add constraint "user_following_user_2__id_foreign" foreign key ("user_2__id") references "user" ("_id") on update cascade on delete cascade;');
        this.addSql('drop table if exists "follow" cascade;');
    }
}
exports.Migration20220705190727 = Migration20220705190727;
//# sourceMappingURL=Migration20220705190727.js.map