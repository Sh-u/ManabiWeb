"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220704140537 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220704140537 extends migrations_1.Migration {
    async up() {
        this.addSql('create table "user_followers" ("user_1__id" int not null, "user_2__id" int not null);');
        this.addSql('alter table "user_followers" add constraint "user_followers_pkey" primary key ("user_1__id", "user_2__id");');
        this.addSql('alter table "user_followers" add constraint "user_followers_user_1__id_foreign" foreign key ("user_1__id") references "user" ("_id") on update cascade on delete cascade;');
        this.addSql('alter table "user_followers" add constraint "user_followers_user_2__id_foreign" foreign key ("user_2__id") references "user" ("_id") on update cascade on delete cascade;');
        this.addSql('alter table "pitch_accent" add column "descriptive" jsonb null, add column "mora" jsonb null;');
    }
    async down() {
        this.addSql('drop table if exists "user_followers" cascade;');
        this.addSql('alter table "pitch_accent" drop column "descriptive";');
        this.addSql('alter table "pitch_accent" drop column "mora";');
    }
}
exports.Migration20220704140537 = Migration20220704140537;
//# sourceMappingURL=Migration20220704140537.js.map