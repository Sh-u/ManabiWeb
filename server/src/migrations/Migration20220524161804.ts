import { Migration } from '@mikro-orm/migrations';

export class Migration20220524161804 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "post" add column "word" text not null, add column "user_audio" text null;');
    this.addSql('alter table "post" rename column "title" to "sentence";');
    this.addSql('alter table "post" rename column "audio" to "dictionary_audio";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "post" add column "title" text not null, add column "audio" text null;');
    this.addSql('alter table "post" drop column "sentence";');
    this.addSql('alter table "post" drop column "word";');
    this.addSql('alter table "post" drop column "dictionary_audio";');
    this.addSql('alter table "post" drop column "user_audio";');
  }

}
