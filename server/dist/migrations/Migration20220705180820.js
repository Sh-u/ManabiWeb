"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220705180820 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220705180820 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table "follow" drop constraint "follow_user_1__id_foreign";');
        this.addSql('alter table "follow" drop constraint "follow_user_2__id_foreign";');
        this.addSql('alter table "follow" add column "follower__id" int not null, add column "user__id" int not null;');
        this.addSql('alter table "follow" drop constraint "follow_pkey";');
        this.addSql('alter table "follow" add constraint "follow_follower__id_foreign" foreign key ("follower__id") references "user" ("_id") on update cascade on delete cascade;');
        this.addSql('alter table "follow" add constraint "follow_user__id_foreign" foreign key ("user__id") references "user" ("_id") on update cascade on delete cascade;');
        this.addSql('alter table "follow" drop column "user_1__id";');
        this.addSql('alter table "follow" drop column "user_2__id";');
        this.addSql('alter table "follow" add constraint "follow_pkey" primary key ("follower__id", "user__id");');
    }
    async down() {
        this.addSql('alter table "follow" drop constraint "follow_follower__id_foreign";');
        this.addSql('alter table "follow" drop constraint "follow_user__id_foreign";');
        this.addSql('alter table "follow" add column "user_1__id" int not null, add column "user_2__id" int not null;');
        this.addSql('alter table "follow" drop constraint "follow_pkey";');
        this.addSql('alter table "follow" add constraint "follow_user_1__id_foreign" foreign key ("user_1__id") references "user" ("_id") on update cascade on delete cascade;');
        this.addSql('alter table "follow" add constraint "follow_user_2__id_foreign" foreign key ("user_2__id") references "user" ("_id") on update cascade on delete cascade;');
        this.addSql('alter table "follow" drop column "follower__id";');
        this.addSql('alter table "follow" drop column "user__id";');
        this.addSql('alter table "follow" add constraint "follow_pkey" primary key ("user_1__id", "user_2__id");');
    }
}
exports.Migration20220705180820 = Migration20220705180820;
//# sourceMappingURL=Migration20220705180820.js.map