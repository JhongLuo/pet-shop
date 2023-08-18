Last class, you learned about why Bitcoin is an innovative type of currency.
You learned that Bitcoin's brings three major innovations: 

The first innovation is Bitcoin's security model based on cryptography.
Bitcoin's use of cryptography enables it to draw an unbreakable security perimeter around each transaction and
this modus operandi replaces the traditional concept of a security perimeter around a database of a company.

One implication of this change is that 
companies can now utilize shared databases called Distributed Ledger Technologies, whereas 
before the advent of individually secured transactions, 
cryptographically secured,
each company was isolated by its own security perimeter protecting its private database.

The second innovation is Bitcoin's programmability.
This programmability has enormous implications for society because
if money is programmable, it means users can be strongly incentivized 
to change their behavior in the interest of whoever controls the blockchain.
As you can imagine, this innovation can bring heaven or hell, as
the road to hell is paved with good intentions.

The third innovation is Bitcoin's decentralization, which
is an effect of a new type of distributed network consensus protocol called Proof of Work.
This third innovation makes it difficult (though not impossible) 
for a single node (that is, a single miner) to control the network.
Thus the danger involved in the second innovation,
the programmability and the consequent potential for tyranny,
is countered by the third innovation,
the decentralization which makes harder the advent of such tyranny.
Of course, Bitcoin's decentralization is not guaranteed:
a lot of it depends on having a distribution of the network's hashing power that is not too concentrated.

In this class, we will address the fundamentals of Bitcoin's security model,
which, as we mentioned,
is a novel security model that draws a security perimeter around each transaction.

This security perimeter is based on cryptography:
so it is very important to understand the basics of how cryptography works.
In this class, we will explain the concepts of a hash function and its products: the digital signature and the hashing puzzle.
We explain how digital signatures are used in Bitcoin transaction scripts.
We also explain how a hashing puzzle is used in the Proof of Work consensus protocol,
a consensus whose objective is to impose an agreement about transaction order 
so as to prevent transaction orders where a user spends the same coin twice.

The Proof of Work consensus enables miners to settle this transaction order ALMOST "once and for all,"
Because there exists a small probability that the transaction order will change in the future.
But crucially,  this probability decreases as the transactional ledger gets longer.
A transaction can be considered irreversible (and therefore safe) when
the ledger or history of transactions after a transaction of interest is long enough.

Bitcoin's creator, Satoshi Nakamoto, 
carried out the calculations of 
how long that history needs to be for a transaction of interest to be irreversible enough.
He did this in his famous white paper: 
Bitcoin: A peer-to-peer electronic cash system, published in 2008, which
you were supposed to read last session.
Because these calculations are critical
to an understanding of Bitcoin's security model,
in this class, 
we are going to cover those calculations in some detail, and
your Session Exercise you will be to answer some questions about Nakamoto's calculations.


Birthday Paradox:

Hashing is used in Bitcoin to construct identifiers that link blocks into chains and 
are meant to guarantee the integrity of the data in the blocks.  
The identifiers constructed via the use of a hashing function are treated in Bitcoin 
as though they are unique, 
though theoretically, a hashing function does not guarantee lack of collisions 
(two different inputs may hash to the same output). 
The hashing function used in Bitcoin is SHA-256 where 256 refers to the length of the output (256 bits).  
Today's class discusses why this length is important and 
how we can say that in order to have a 90% probability of producing a collision with SHA-256, 
one needs to have created via hashing an enormous number of hashes: 2^130. 
This means that, since the fastest ASIC machines 
have a hash rate of 112 tera hashes per second (112*1,000,000,000,000 h/s), 
in order to have a 90% probability of finding a hash collision with SHA-256, 
an ASIC machine must hash for 3.85E+17 years.

Regarding Collisions:

This all-important idea of collision appears when blockchain identifiers or ids of all types are discussed;
And a great way of introducing and understanding the idea of collision is the example of the “birthday paradox” that you have uploaded today.
Since collision is central in hashing, we’ll re-visit the “birthday paradox” again in the future (also as a prime example to analyze collision), but in the context of hashing algorithms.
We will not do it yet because you still don’t have the understanding of the concepts needed to discuss hashing in its full complexity, but you will by the end of this course.
Let me talk a bit about hashing, though, since we’ll use the term a lot before then.
The introduction of the hash functions that we’ll do in the future responds more to a practical need than to a theoretical one. 
What I mean is that hashing has no cryptographic role since it is just the guarantor of “size standardization” in the digital world, 
but to be able to fulfill this role, it is essential to build the algorithm in such a way that the final product is able to avoid “collision” (or maintain injectivity, as mathematicians would say). 
Let me mention that during the discussion on hashing, there is always a debate between [trying a “literary/descriptive” approach to the hashing algorithms] or [going “knee-deep” into the sometimes highly-involved calculations]. 
We’ll select the second option in the hope of giving you a real taste of the complexity that underlies the clean-looking appearance of the blockchain’s “journalistic” (unrealistic) view. 
We polished and cleaned the example up to the point where it is feasible to see how these useful, faithful and ingenious workhorses operate.
Now, back to the birthday paradox, let’s start by quoting Dirichlet, one of the greatest western minds, and precursor of modern number theory
The “Dirichlet” or “pigeon hole principle” says, as you know, that if 5 pigeons fly into 4 holes, two of them must end up in the same hole.

Now let’s suppose that we have 5 people (a, b, c, d, e) standing in line, and a bag with four numbered tokens: 1, 2, 3, 4;

If we ask each one of the persons to pick a numbered token, 
tattoo the number in his hand and then return the numbered token to the bag, 
what is the probability that two persons will pick the same number?

That probability is obviously 1 because of the Dirichlet principle that we just mentioned.

In other words:

If we say that “a collision” occurs when two persons get the same numbered token, 
the probability of collision equals 1 when the number of people is larger than the number of tokens. 

But such an obvious case is not of interest to us.

The interesting question is: what is the probability of collision 
when the number of people is smaller than the numbered tokens in the bag?

To answer this, let’s suppose that now we have 3 people (a, b, c) standing in line, and a bag with four numbered tokens: 1, 2, 3 & 4.

If we ask each person to pick a numbered token, 
to tatoo in his hand the number he gets

And then return the numbered token to the bag, 
what is the probability that two persons will pick the same number?
The answer to this question is the core of the “birthday paradox” example, called “paradox” because 
the counterintuitive nature of its outcome!


