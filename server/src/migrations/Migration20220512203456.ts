import { Migration } from '@mikro-orm/migrations';

export class Migration20220512203456 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "deck" ("_id" serial primary key, "title" text not null, "author__id" int not null, "posts" text[] null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');

    this.addSql('alter table "deck" add constraint "deck_author__id_foreign" foreign key ("author__id") references "user" ("_id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "deck" cascade;');
  }

}
