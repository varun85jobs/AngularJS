describe('menu 0 item', function () {
    beforeEach(function () {
        browser.get('index.html#/menu/0');
    });

    it('should have a name', function () {
        var name = element(by.binding('dish.name'));
        expect(name.getText()).toEqual('Uthapizza Hot $4.99');
    });

    it('should show the number of comments as', function () {
        expect(element.all(by.repeater('comment in dish.comments'))
            .count()).toEqual(6);

    });

    it('should show the first comment author as', function () {
        element(by.model('dish.orderCriteria')).sendKeys('author');
        expect(element.all(by.repeater('comment in dish.comments'))
            .count()).toEqual(6);
        var author = element.all(by.repeater('comment in dish.comments'))
            .first().element(by.binding('comment.author'));

        expect(author.getText()).toContain('25 Cent');

    });

    //Getting element by using id here instead of by.model
    it('should show the first comment author as', function () {
        element(by.id('sort')).sendKeys('author');
        expect(element.all(by.repeater('comment in dish.comments'))
            .count()).toEqual(6);
        var author = element.all(by.repeater('comment in dish.comments'))
            .first().element(by.binding('comment.author'));

        expect(author.getText()).toContain('25 Cent');

    });
});
