desc "Database backup"
task :cron => :environment do
    puts "Backing up..."
    system "heroku pgbackups:capture --expire --app jilli"
    puts "Done."
end
