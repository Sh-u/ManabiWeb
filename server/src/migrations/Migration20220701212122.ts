import { Migration } from '@mikro-orm/migrations';

export class Migration20220701212122 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "card" alter column "dictionary_meaning" type text[] using ("dictionary_meaning"::text[]);');
  }

  async down(): Promise<void> {
    this.addSql('alter table "card" alter column "dictionary_meaning" type text using ("dictionary_meaning"::text);');
  }

}
