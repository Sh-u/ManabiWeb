import { Migration } from '@mikro-orm/migrations';

export class Migration20220616203506 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "image" text null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "image";');
  }

}
