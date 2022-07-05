"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220705180752 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220705180752 extends migrations_1.Migration {
    async up() {
        this.addSql('create table "user" ("_id" serial primary key, "image" text null, "username" text not null, "password" text not null, "email" text not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "badge" text not null, "day_streak" int not null, "card_studied" int not null);');
        this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');
        this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
        this.addSql('create table "deck" ("_id" serial primary key, "title" text not null, "user__id" int not null, "japanese_template" boolean null, "steps" text[] not null, "graduating_interval" int not null, "starting_ease" int not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
        this.addSql('create table "deck_subscriber" ("_id" serial primary key, "user__id" int not null, "deck__id" int not null);');
        this.addSql('create table "follow" ("user_1__id" int not null, "user_2__id" int not null);');
        this.addSql('alter table "follow" add constraint "follow_pkey" primary key ("user_1__id", "user_2__id");');
        this.addSql('create table "card" ("_id" serial primary key, "sentence" text not null, "word" text not null, "furigana" text null, "image" text null, "dictionary_meaning" text[] null, "dictionary_audio" text null, "user_audio" text null, "deck__id" int not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
        this.addSql('create table "card_progress" ("_id" serial primary key, "user__id" int not null, "card__id" int not null, "state" varchar(255) not null, "steps" int not null, "next_revision" timestamptz(0) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
        this.addSql('create table "pitch_accent" ("_id" serial primary key, "descriptive" jsonb null, "mora" jsonb null, "part" jsonb not null, "high" jsonb not null, "card__id" int not null);');
        this.addSql('alter table "deck" add constraint "deck_user__id_foreign" foreign key ("user__id") references "user" ("_id") on update cascade;');
        this.addSql('alter table "deck_subscriber" add constraint "deck_subscriber_user__id_foreign" foreign key ("user__id") references "user" ("_id") on update cascade;');
        this.addSql('alter table "deck_subscriber" add constraint "deck_subscriber_deck__id_foreign" foreign key ("deck__id") references "deck" ("_id") on update cascade;');
        this.addSql('alter table "follow" add constraint "follow_user_1__id_foreign" foreign key ("user_1__id") references "user" ("_id") on update cascade on delete cascade;');
        this.addSql('alter table "follow" add constraint "follow_user_2__id_foreign" foreign key ("user_2__id") references "user" ("_id") on update cascade on delete cascade;');
        this.addSql('alter table "card" add constraint "card_deck__id_foreign" foreign key ("deck__id") references "deck" ("_id") on update cascade;');
        this.addSql('alter table "card_progress" add constraint "card_progress_user__id_foreign" foreign key ("user__id") references "user" ("_id") on update cascade;');
        this.addSql('alter table "card_progress" add constraint "card_progress_card__id_foreign" foreign key ("card__id") references "card" ("_id") on update cascade;');
        this.addSql('alter table "pitch_accent" add constraint "pitch_accent_card__id_foreign" foreign key ("card__id") references "card" ("_id") on update cascade;');
    }
    async down() {
        this.addSql('alter table "deck" drop constraint "deck_user__id_foreign";');
        this.addSql('alter table "deck_subscriber" drop constraint "deck_subscriber_user__id_foreign";');
        this.addSql('alter table "follow" drop constraint "follow_user_1__id_foreign";');
        this.addSql('alter table "follow" drop constraint "follow_user_2__id_foreign";');
        this.addSql('alter table "card_progress" drop constraint "card_progress_user__id_foreign";');
        this.addSql('alter table "deck_subscriber" drop constraint "deck_subscriber_deck__id_foreign";');
        this.addSql('alter table "card" drop constraint "card_deck__id_foreign";');
        this.addSql('alter table "card_progress" drop constraint "card_progress_card__id_foreign";');
        this.addSql('alter table "pitch_accent" drop constraint "pitch_accent_card__id_foreign";');
        this.addSql('drop table if exists "user" cascade;');
        this.addSql('drop table if exists "deck" cascade;');
        this.addSql('drop table if exists "deck_subscriber" cascade;');
        this.addSql('drop table if exists "follow" cascade;');
        this.addSql('drop table if exists "card" cascade;');
        this.addSql('drop table if exists "card_progress" cascade;');
        this.addSql('drop table if exists "pitch_accent" cascade;');
    }
}
exports.Migration20220705180752 = Migration20220705180752;
//# sourceMappingURL=Migration20220705180752.js.map