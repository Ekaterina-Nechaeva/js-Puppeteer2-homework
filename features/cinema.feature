Feature: Buying movie tickets
    Scenario: Active booking button when selecting seats
        Given user is on the cinema schedule page
        When user selects day 3 and the film "Ведьмак" at "17:00"
        And user selects seat 5 in row 7
        And user selects seat 6 in row 7
        Then 2 seats are selected
        And the "book" button is active

    Scenario: Proceed to ticket confirmation  
        Given user is on the cinema schedule page
        When user selects day 2 and the film "Ведьмак" at "17:00"
        And user selects seat 5 in row 7
        And user selects seat 6 in row 7
        And user clicks "Забронировать"
        Then a page opens with the text "Вы выбрали билеты:" 

    Scenario: Cannot select an already taken seat
       Given user is on the cinema schedule page with a taken seat
        When user selects day 4 and the film "Need for Speed" at "20:00"
        And user tries to select the taken seat
        Then 0 seats are selected
        And the "book" button is disabled