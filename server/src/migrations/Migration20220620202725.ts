import { Migration } from '@mikro-orm/migrations';

export class Migration20220620202725 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "post" alter column "sentence" drop default;');
    this.addSql('alter table "post" alter column "sentence" type text using ("sentence"::text);');
    this.addSql('alter table "post" alter column "word" drop default;');
    this.addSql('alter table "post" alter column "word" type text using ("word"::text);');
  }

  async down(): Promise<void> {
    this.addSql('alter table "post" alter column "sentence" type text using ("sentence"::text);');
    this.addSql('alter table "post" alter column "sentence" set default \'\';');
    this.addSql('alter table "post" alter column "word" type text using ("word"::text);');
    this.addSql('alter table "post" alter column "word" set default \'\';');
  }

}
