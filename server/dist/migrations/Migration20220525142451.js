"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220525142451 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220525142451 extends migrations_1.Migration {
    async up() {
        this.addSql('create table "user" ("_id" serial primary key, "username" text not null, "password" text not null, "email" text not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
        this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');
        this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
        this.addSql('create table "deck" ("_id" serial primary key, "title" text not null, "author__id" int not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
        this.addSql('create table "post" ("_id" serial primary key, "sentence" text not null default \'\', "word" text not null default \'\', "image" text null, "dictionary_audio" text null, "user_audio" text null, "deck__id" int not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
        this.addSql('alter table "deck" add constraint "deck_author__id_foreign" foreign key ("author__id") references "user" ("_id") on update cascade;');
        this.addSql('alter table "post" add constraint "post_deck__id_foreign" foreign key ("deck__id") references "deck" ("_id") on update cascade;');
    }
    async down() {
        this.addSql('alter table "deck" drop constraint "deck_author__id_foreign";');
        this.addSql('alter table "post" drop constraint "post_deck__id_foreign";');
        this.addSql('drop table if exists "user" cascade;');
        this.addSql('drop table if exists "deck" cascade;');
        this.addSql('drop table if exists "post" cascade;');
    }
}
exports.Migration20220525142451 = Migration20220525142451;
//# sourceMappingURL=Migration20220525142451.js.map