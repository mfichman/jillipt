require 'heroku/command'

desc "Database backup"
task :cron => :environment do
    puts "Backing up..."
    Heroku::Command.load
    backup = Heroku::Command::Pgbackups.new([], {
        :app => ENV['HEROKU_APP_NAME'],
        :expire => true
    })
    backup.capture
    puts backup
    puts "Done."
end
