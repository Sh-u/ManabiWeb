import { Migration } from '@mikro-orm/migrations';

export class Migration20220608160734 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "deck_subscriber" ("_id" serial primary key, "user__id" int not null, "deck__id" int not null);');

    this.addSql('alter table "deck_subscriber" add constraint "deck_subscriber_user__id_foreign" foreign key ("user__id") references "user" ("_id") on update cascade;');
    this.addSql('alter table "deck_subscriber" add constraint "deck_subscriber_deck__id_foreign" foreign key ("deck__id") references "deck" ("_id") on update cascade;');

    this.addSql('drop table if exists "deck_subscribers" cascade;');
  }

  async down(): Promise<void> {
    this.addSql('create table "deck_subscribers" ("deck__id" int not null, "user__id" int not null);');
    this.addSql('alter table "deck_subscribers" add constraint "deck_subscribers_pkey" primary key ("deck__id", "user__id");');

    this.addSql('alter table "deck_subscribers" add constraint "deck_subscribers_deck__id_foreign" foreign key ("deck__id") references "deck" ("_id") on update cascade on delete cascade;');
    this.addSql('alter table "deck_subscribers" add constraint "deck_subscribers_user__id_foreign" foreign key ("user__id") references "user" ("_id") on update cascade on delete cascade;');

    this.addSql('drop table if exists "deck_subscriber" cascade;');
  }

}
