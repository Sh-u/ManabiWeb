import { Migration } from '@mikro-orm/migrations';

export class Migration20220706173924 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "pitch_accent" alter column "kana" type jsonb using ("kana"::jsonb);');
    this.addSql('alter table "pitch_accent" alter column "kana" drop not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "pitch_accent" alter column "kana" type varchar(255) using ("kana"::varchar(255));');
    this.addSql('alter table "pitch_accent" alter column "kana" set not null;');
  }

}
