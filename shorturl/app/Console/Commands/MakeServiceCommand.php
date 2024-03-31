<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;

class MakeServiceCommand extends Command
{
    protected $signature = 'make:service {name}';

    protected $description = 'Create a new service class';

    public function handle()
    {
        $name = $this->argument('name');
        $className = Str::studly($name);
        $fileName = $className . '.php';
        $filePath = app_path('Services/' . $fileName);

        if (file_exists($filePath)) {
            $this->error('Service already exists!');
            return;
        }

        $stub = file_get_contents(__DIR__ . '/stubs/service.stub');
        $stub = str_replace('{{ClassName}}', $className, $stub);

        file_put_contents($filePath, $stub);

        $this->info('Service created successfully: ' . $className);
    }
}