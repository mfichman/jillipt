class FlashCardsController < ApplicationController
  # GET /flash_cards
  # GET /flash_cards.xml
  def index
    @flash_cards = FlashCard.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render :json => @flash_cards }
      format.xml  { render :xml => @flash_cards }
    end
  end

  # GET /flash_cards/1
  # GET /flash_cards/1.xml
  def show
    @flash_card = FlashCard.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render :json => @flash_card }
      format.xml  { render :xml => @flash_card }
    end
  end

  # GET /flash_cards/new
  # GET /flash_cards/new.xml
  def new
    @flash_card = FlashCard.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render :json => @flash_card }
      format.xml  { render :xml => @flash_card }
    end
  end

  # GET /flash_cards/1/edit
  def edit
    @flash_card = FlashCard.find(params[:id])
  end

  # POST /flash_cards
  # POST /flash_cards.xml
  def create
    @flash_card = FlashCard.new(params[:flash_card])

    respond_to do |format|
      if @flash_card.save
        format.html { redirect_to(@flash_card, :notice => 'Flash card was successfully created.') }
        format.json { render :json => @flash_card, :status => :created, :location => @flash_card }
        format.xml  { render :xml => @flash_card, :status => :created, :location => @flash_card }
      else
        format.html { render :action => "new" }
        format.json { render :json => @flash_card.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @flash_card.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /flash_cards/1
  # PUT /flash_cards/1.xml
  def update
    @flash_card = FlashCard.find(params[:id])

    respond_to do |format|
      if @flash_card.update_attributes(params[:flash_card])
        format.html { redirect_to(@flash_card, :notice => 'Flash card was successfully updated.') }
        format.json { render :json => [] }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.json { render :json => @flash_card.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @flash_card.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /flash_cards/1
  # DELETE /flash_cards/1.xml
  def destroy
    @flash_card = FlashCard.find(params[:id])
    @flash_card.destroy

    respond_to do |format|
      format.html { redirect_to(flash_cards_url) }
      format.json { render :json => [] }
      format.xml  { head :ok }
    end
  end

  # GET /flash_cards/search
  # GET /flash_cards/search.xml
  def search
    @flash_cards = FlashCard.search(params[:query])
    @summary_array = @flash_cards.collect do |card|
      { :text => card.front, :id => card.id }
    end

    respond_to do |format|
      format.json { render :json => @summary_array }
    end
  end

  # GET /flash_cards/aext
  # GET /flash_cards/next.xml
  def next
    params[:topic] ||= ''
    @flash_cards = FlashCard.find(
      :all,
      :conditions => ["lower(topic) = ?", params[:topic].downcase],
      :order => :id
    )
    found = false
    @flash_card = @flash_cards.detect do |item|
      if found
        next true 
      elsif item.id.to_s == params[:id] 
        found = true
      end
      false 
    end || @flash_cards.first

    respond_to do |format|
      format.json { render :json => @flash_card }
    end
  end

  # GET /flash_cards/prev
  # GET /flash_cards/prev.xml
  def prev
    params[:topic] ||= ''
    @flash_cards = FlashCard.find(
      :all,
      :conditions => ["lower(topic) = ?", params[:topic].downcase],
      :order => :id
    )
    @flash_card = nil
    @flash_cards.detect do |item|
        if item.id.to_s == params[:id]
            next true
        end
        @flash_card = item
        false
    end
    @flash_card ||= @flash_cards.last
    
    respond_to do |format|
        format.json { render :json => @flash_card }
    end
  end
end
