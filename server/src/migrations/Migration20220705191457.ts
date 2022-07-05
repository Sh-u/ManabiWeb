import { Migration } from '@mikro-orm/migrations';

export class Migration20220705191457 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "follow" drop constraint "follow_following_id_foreign";');

    this.addSql('alter table "follow" drop constraint "follow_pkey";');
    this.addSql('alter table "follow" rename column "following_id" to "followed_user__id";');
    this.addSql('alter table "follow" add constraint "follow_followed_user__id_foreign" foreign key ("followed_user__id") references "user" ("_id") on update cascade on delete cascade;');
    this.addSql('alter table "follow" add constraint "follow_pkey" primary key ("followed_user__id", "user__id");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "follow" drop constraint "follow_followed_user__id_foreign";');

    this.addSql('alter table "follow" drop constraint "follow_pkey";');
    this.addSql('alter table "follow" rename column "followed_user__id" to "following_id";');
    this.addSql('alter table "follow" add constraint "follow_following_id_foreign" foreign key ("following_id") references "user" ("_id") on update cascade on delete cascade;');
    this.addSql('alter table "follow" add constraint "follow_pkey" primary key ("following_id", "user__id");');
  }

}
