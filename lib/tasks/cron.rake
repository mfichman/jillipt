require 'heroku/command'

desc "Database backup"
task :cron => :environment do
    puts "Backing up..."
    Heroku::Auth.credentials = [ENV['HEROKU_USERNAME'], ENV['HEROKU_API_KEY']]
    Heroku::Command.load
    backup = Heroku::Command::Pgbackups.new([], {:app => 'jilli', :expire => true})
    backup.capture
    puts "Done."
end
