---
layout: post
title: "Tree Parser"
date: 2016-07-03 18:30:34 -0700
comments: true
categories: [PHP]
---

I just wrote a PHP library [baopham/tree-parser](https://github.com/baopham/php-tree-parser) to parse a specific tree content to PHP objects.

This library can parse this tree content:

```
   Root
    |- Level 1 - Order 1
      |- Level 2 - Order 2
        |- Level 3 - Order 3
        |- Level 3 - Order 4
      |- Level 2 - Order 5
    |- Level 1 - Order 6
      |- Level 2 - Order 7
        |- Level 3 - Order 8
          |- Level 4 - Order 9
```

into this:

```php

foreach ($root->children as $child) {
    print $child->name;

    print $child->order;

    print $child->level;

    print_r($child->children);

    print_r($child->children[0]->children);

    print $child->children[0]->parent === $child;
}

print $root->isRoot

// assuming we got the $lastLeaf after done traversing down.
print $lastLeaf->parent->parent->parent->parent === $root
```

### Advanced

```php
$tree = <<<TREE
  Root
    |- Level 1 - Order 1
      |- Level 2 - Order 2
        |- Level 3 - Order 3
        |- Level 3 - Order 4
      |- Level 2 - Order 5
    |- Level 1 - Order 6
      |- Level 2 - Order 7
        |- Level 3 - Order 8
          |- Level 4 - Order 9
TREE;

$parser = new BaoPham\TreeParser($tree);

$parser->parse();

$structure = $parser->getStructure();

// Get nodes at level 3
$level3Nodes = $structure[3];
// Get node at level 3, order 4
$node = $structure[3][4];

// Get last leaf
$orderedNodes = $parser->getOrderedNodes();
$lastLeaf = $orderedNodes[count($orderedNodes) - 1];
```
