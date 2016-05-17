---
layout: post
title: "Modelling with Behat and Laravel Examples"
date: 2016-05-17 00:52:27 -0700
comments: true
categories: [Behat, PHP, Laravel]
---

Follow up from my previous [post](http://baopham.github.io/blog/2016/04/03/modelling-with-behat-and-laravel/), here is a example feature (similar to the feature from the [original post](http://stakeholderwhisperer.com/posts/2014/10/introducing-modelling-by-example))

### behat.yml


```
default:
    suites:
      product_payment_domain:
        contexts: [ ProductPaymentDomainContext ]
        filters:  { tags: '@product_payment' }
      product_payment_ui:
        contexts: [ ProductPaymentUIContext ]
        filters:  { tags: '@product_payment&&@critical' }
    gherkin:
      filters:
        tags: ~@wip
    extensions:
        Laracasts\Behat:
            #env_path: .env.behat
        Behat\MinkExtension:
            base_url: https://e-commerce.dev
            default_session: laravel
            laravel: ~
            selenium2:
              wd_host: "http://selenium-server.dev:4444/wd/hub"
            browser_name: chrome
```

### Feature and Scenarios

> How To Write Scenarios
>
> Focus on describing the problem you're trying to solve, rather than focusing on the "how" and the "look". For example, don't mention anything about "I click button x" or "I go page /path/to/page" or "I should see ABC on sidebar" or "I wait" in your scenarios.
>
> Read more here: [Introducing Modelling by Example](http://stakeholderwhisperer.com/posts/2014/10/introducing-modelling-by-example)

```
Feature: Product payment
  In order to receive products
  As a customer
  I need to be able to pay for the products that I have selected

  Scenario: Buying a product that is out of stock
    Given I have put the product "Windows ME" in my basket a few days before
    And product "Window ME" is now out of stock
    Then I should not be able to checkout because "Window ME" is out of stock

  Scenario: Cannot buy if product is restricted in the account's country
    Given I am located in a country that does not allow product "FooBar"
    Then I cannot purchase this product
```

How I would implement the steps in the Domain Context class:

```php
    /**
     * @Given I have put the product :product in my basket a few days before
     */
    public function iHavePutTheProductInMyBasket($product)
    {
        $this->product = factory(Product::class)->create(['name' => $product]);

        $this->basket->put($this->product);
    }

    /**
     * @Given product :product is now out of stock
     */
    public function ProductIsOutOfStock($product)
    {
        $this->product->count = 0;

        $this->product->save();
    }

    /**
     * @Then I should not be able to checkout because :product is out of stock
     */
    public function iShouldNotBeAbleToCheckoutBecauseProductIsOutOfStock($product)
    {
        $this->assertException(function () {
            $this->basket->checkout();
        }, ProductIsOutOfStock::class);
    }

    /**
     * @Given I am located in a country that does not allow product :product
     */
    public function iAmLocatedInACountryThatDoesNotAllowProduct($product)
    {
        $this->currentUser = factory(User::class)->create();

        $this->product = factory(Product::class)->create(['name' => $product]);

        $this->currentUser->country->restricted_products()->sync([$this->product->id]);
    }

    /**
     * @Then I cannot purchase this product
     */
    public function iCannotPurchaseThisProduct()
    {
        $this->currentUser->cannot('purchase', $this->product);
    }
```

where the method `assertException` is a custom method:

```php
    /**
     * @param Closure $closure
     * @param string $exception
     */
    protected function assertException(\Closure $closure, $exception)
    {
        $fail = false;

        try {
            $closure();

            $fail = true;
        } catch (\Exception $e) {
            if (!($e instanceof $exception)) {
                $fail = true;
            }
        }

        if ($fail) {
            $this->fail("Expected $exception to be thrown");
        }
    }
```

and if you follow my [previous post](http://baopham.github.io/blog/2016/04/03/modelling-with-behat-and-laravel/), the `assertEquals` is forwarded to the `PHPUnit_Framework_Assert` class.
