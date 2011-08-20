module GhettoSearch

  # Searches through all the string fields of the model, and returns records
  # that contain each search term somewhere in the model at least once.
  def search(query, options={}) 
    return [] unless query
    terms = query.downcase.split()
    return [] if terms.empty?

    self.all.select do |record|
      terms.reject do |term|
        record.attributes.detect do |key, value|
          if options[:only] && !options[:only].include?(key)
            return false
          end
          value.class == String && value.downcase.include?(term)
        end
      end.empty?
    end
  end

end
