import { Migration } from '@mikro-orm/migrations';

export class Migration20220706175410 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "pitch_accent" alter column "descriptive" type text using ("descriptive"::text);');
    this.addSql('alter table "pitch_accent" alter column "mora" type int using ("mora"::int);');
    this.addSql('alter table "pitch_accent" alter column "word" type text using ("word"::text);');
    this.addSql('alter table "pitch_accent" alter column "kana" type text using ("kana"::text);');
  }

  async down(): Promise<void> {
    this.addSql('alter table "pitch_accent" alter column "descriptive" type jsonb using ("descriptive"::jsonb);');
    this.addSql('alter table "pitch_accent" alter column "mora" type jsonb using ("mora"::jsonb);');
    this.addSql('alter table "pitch_accent" alter column "word" type jsonb using ("word"::jsonb);');
    this.addSql('alter table "pitch_accent" alter column "kana" type jsonb using ("kana"::jsonb);');
  }

}
