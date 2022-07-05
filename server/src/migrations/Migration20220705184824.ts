import { Migration } from '@mikro-orm/migrations';

export class Migration20220705184824 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user_following" ("user_1__id" int not null, "user_2__id" int not null);');
    this.addSql('alter table "user_following" add constraint "user_following_pkey" primary key ("user_1__id", "user_2__id");');

    this.addSql('alter table "user_following" add constraint "user_following_user_1__id_foreign" foreign key ("user_1__id") references "user" ("_id") on update cascade on delete cascade;');
    this.addSql('alter table "user_following" add constraint "user_following_user_2__id_foreign" foreign key ("user_2__id") references "user" ("_id") on update cascade on delete cascade;');

    this.addSql('drop table if exists "follow" cascade;');
  }

  async down(): Promise<void> {
    this.addSql('create table "follow" ("follower__id" int not null, "user__id" int not null);');
    this.addSql('alter table "follow" add constraint "follow_pkey" primary key ("follower__id", "user__id");');

    this.addSql('alter table "follow" add constraint "follow_follower__id_foreign" foreign key ("follower__id") references "user" ("_id") on update cascade on delete cascade;');
    this.addSql('alter table "follow" add constraint "follow_user__id_foreign" foreign key ("user__id") references "user" ("_id") on update cascade on delete cascade;');

    this.addSql('drop table if exists "user_following" cascade;');
  }

}