<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\TicketCategory;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin IT Support',
            'email' => 'admin@politekmitra.ac.id',
            'password' => bcrypt('password'),
            'department' => 'IT Department',
            'role' => UserRole::ADMIN,
            'email_verified_at' => now(),
        ]);

        // Create sample user
        User::create([
            'name' => 'Budi Santoso',
            'email' => 'budi@politekmitra.ac.id',
            'password' => bcrypt('password'),
            'department' => 'Administrasi',
            'role' => UserRole::USER,
            'email_verified_at' => now(),
        ]);

        // Seed ticket categories per agents.md Section 3
        $categories = [
            ['name' => 'Hardware', 'description' => 'Device problems, printer failures, peripheral issues'],
            ['name' => 'Software', 'description' => 'Application errors, installation requests, software bugs'],
            ['name' => 'Network', 'description' => 'Network issues, connectivity problems, VPN'],
            ['name' => 'Account', 'description' => 'Account access issues, password problems, permissions'],
            ['name' => 'Other', 'description' => 'General IT requests and inquiries'],
        ];

        foreach ($categories as $category) {
            TicketCategory::create($category);
        }
    }
}
