import { Migration } from '@mikro-orm/migrations';

export class Migration20220606141544 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "deck" drop constraint "deck_author__id_foreign";');

    this.addSql('alter table "deck" rename column "author__id" to "user__id";');
    this.addSql('alter table "deck" add constraint "deck_user__id_foreign" foreign key ("user__id") references "user" ("_id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "deck" drop constraint "deck_user__id_foreign";');

    this.addSql('alter table "deck" rename column "user__id" to "author__id";');
    this.addSql('alter table "deck" add constraint "deck_author__id_foreign" foreign key ("author__id") references "user" ("_id") on update cascade;');
  }

}
