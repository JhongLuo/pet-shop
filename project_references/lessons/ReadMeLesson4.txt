In this class, we are going to cover wallets and
because wallets are today an intrinsic part of exchanges,
we are going to cover exchanges as well.

We are going to focus on practical aspects like
selecting a wallet that is safe.

You have seen how cryptographic hashes
can be used to construct id numbers that 
are used for all kinds of indexing
in the blockchain database.
You also read about hash collisions
in The Birthday Problem and
how collisions are expected to be extremely rare
for the hash function used in Bitcoin: SHA 256.

In this class, you will learn how
private and public Bitcoin keys are generated.
Private and public keys are not generated
through hashing.
Instead, they involve the use of
a random number generator, and 
another cryptographic function:
the Elliptic Curve function.

When it comes to collisions,
it is possible for two private keys 
(and their respective public keys) to collide.
But the probability of this happening is infinitesimally small.

The reason is that Bitcoin private address space
is as large as 2 to the 256 since
the private keys are 32 bytes long.

The elliptic curve function is a deterministic function 
mapping private keys to public keys.
But this mapping is such that 
it is easy to calculate in one direction only:
that is,
it is easy to go from the private key to the public key, but
it is impossible in practical terms to go 
from the public key in reverse back to the private key.
In this presentation, we will 
cover this topic and give you some idea why 
the elliptic curve function is so good at covering its tracks.

But in today's presentation, we will not cover
the mathematics of the elliptic curve function in detail.
We will leave that for another session.


Instead,
this presentation will focus on
the more practical aspect of generating private and public keys:
how private keys are randomly generated and encoded,
and 
how public keys are calculated from private keys,
hashed twice and
encoded,
in such a way that 
you will be able to recognize a Bitcoin address when you see one.
To this effect, 
we will show you the operation of a Python program called Blocksmith
that creates private and public Bitcoin keys.

Next, we focus on the practical aspect of 
selecting a wallet that is "safe."

Where by "safe," we mean something altogether different from
the safety of the secrecy of the private keys.

By safety we mean:
how well does the wallet protect your privacy?
or
how well does the wallet protect you from types of fraud
unrelated to the secrecy of the private keys which
is well safeguarded 
by cryptographic elliptic curves.

The question of privacy is a complex one, and
we will return to privacy-focused wallets and cryptocurrencies later on in the course.

But on a basic level,
you will learn that most users prefer single payment verification wallets,
also known as,
SPV- wallets.
SPV wallets are "thin clients" that, by definition,
do not download the entire blockchain onto their drive
(that is why they can be installed in smartphones, for example), and so
their view of the blockchain is incomplete and requires them 
to query other nodes to complete vital information.

So SPV wallets perform a limited type of transaction verification that
relies on the cooperation between the wallet and other nodes on the network that
provide the wallet with information it does not have.
This cooperation between the SPV wallet and the other nodes it queries
exposes the SPV wallet to a loss of privacy that 
the SPV wallet protects against with a device called a Bloom Filter.
Since the role of Bloom Filters is very important,
we cover how they work in this class.

The other question regarding safety is
how well does the wallet protect you from types of fraud
unrelated to the secrecy of the private keys which
is well safeguarded 
by cryptographic elliptic curves.

As you will see today,
wallets are intimately connected to exchanges and
they are able not just to save bitcoin coins and pay bitcoin coins,
but are able  as well to transact one crypto for another or for fiat,

In other words,
Bitcoin exchanges offer their own wallets to their user base and
have incorporated these additional transactional services into their wallets.

But some Bitcoin exchanges are sources of risk, especially centralized ones 
even ones like Binance and Coinbase.
Why?
Because centralized exchanges do not "save" your bitcoin into the Bitcoin blockchain.
That is, they do not write your balance into the Bitcoin blockchain except
when you decide to leave the exchange and close your account with them.
Only at that point does the exchange write your bitcoin balance into the Bitcoin blockchain.

All the time before that "closure of account"
your transactions were written into a regular database, 
(a private database inside the exchange.)

Exchanges avoid writing too many transactions into the Bitcoin blockchain 
in order to lower transactional costs.

In this scenario,
the only guarantee that your bitcoin are secure is the guarantee the exchange gives
of paying you from their reserves.
But not all exchanges provide good guarantees, and
not all exchanges provide evidence of their reserves.

To make matters worse,
centralized exchanges tend to be the focus of attacks, 
many of which have been successful, 
leading to world-famous, or rather infamous,
billionaire thefts and exchange bankruptcies.

So when you use a wallet provided by an exchange,
you obtain extra transactional services 
at the cost of exposure to these extra risks, 
(though
today exchanges give users of their wallets
more control and privacy over their private keys, meaning
the exposure to risks should be somewhat lessened.)

At the end of the presentation,
we discuss a few principles that
ought to guide the decision of which exchange (and wallet) to use.
Basically,
the conclusion of these slides is that
larger, more diversified exchanges 
tend to provide better guarantees.

But, what counts as a large exchange?
Well: a large exchange is one where lots of transactions take place.
One with a large transactional volume.

But it is not so easy to determine the volume traded in an exchange.
Normally this is a quantity reported by the exchange itself
to the crypto data aggregators and to government regulators.

Unfortunately, exchanges have been faking the volume numbers in various ways.

The false volumes were reported to CMC (CoinMarketCap) and other crypto data aggregators
by the exchanges in order to exaggerate the size of the Bitcoin market. 

The problem has been apparent since 
Bitwise Asset Management published a report showing that 
95% of volumes reported by BitcoinExchanges on data aggregator CoinMarketCap were fake.  

Even before that, in 2018, 
trader and investor Sylvain Robes revealed that 
93% of the trading volume on China-based exchange OKEx was fabricated 
based on the “slippage,” or price change.

He later went on to estimate that 
81.2% of trading volumes on Huobi, another China-based exchange, were fabricated. 

Binance, one of the largest trading platforms globally, has similar “slippage,” 
possibly indicating similar levels of fake trading volumes (but this is no proof). 

The fake volume of an exchange consists mostly of "fake trades,"
trades where the exchange is taking both sides of the transaction.
In the U.S. such trades are called “wash trades” and
are already under investigation by the Justice Department. 

For this class, you will be reading that initial report because,
it is still relevant because
the problem is ongoing, it has not been fixed.

Why do exchanges fake their trading volumes?
Higher trading volumes do two things. 
One, they stabilize the crypto market by helping to avoid drastic changes in a crypto’s price after a major sale. 
Two, trading volumes ideally indicate the trustworthiness of a crypto exchange. 

If lots of people are using an exchange to trade something, 
both the exchange and the commodity itself are seen as more trustworthy.

So it seems clear that both the authorities but especially the crypto data aggregators like:
CoinGecko, 
Nomics
Messari, 
CMC (Coin Market Cap)
were deceived by the exchanges for a long time and
unknowingly helped propagate fake volume numbers made up by the exchanges, which
set them up for ridicule!

The crypto data aggregators were partly blamed and rightly so because:
Exchanges faking their trading volumes can be caught.
Especially if there is no correlation between 
the number of website visits a site receives and 
the trading volumes the exchanges report. 

So in May 2020, CMC introduced 
the Liquidity Score:
it incorporates additional information into its ranking algorithm, 
like the exchange’s web traffic, to estimate its user base:
https://support.coinmarketcap.com/hc/en-us/articles/360043836931-Liquidity-Score-Market-Pair-Exchange-
https://support.coinmarketcap.com/hc/en-us/articles/360044481772-Confidence-Indicator-Market-Pair-
https://support.coinmarketcap.com/hc/en-us/articles/360043837171-Web-Traffic-Factor-Exchange-
https://support.coinmarketcap.com/hc/en-us/articles/360043836851-Ranking-Market-Pair-Cryptoasset-

In September 2020 BTI Verified started a publication called
The "crypto market data report"
that tracks the issue of fake volume in the industry as a whole.
According to this publication, the following exchanges are ok:
Coinbase, Upbit, Bittrex, Poloniex.
But this list changes year to year.

They have not yet published this year's crypto market data report though.

Despite this comparison between web traffic to an exchange and exchange transaction volume
the problem is not solved:

An exchange can buy web traffic easily, and 
it’s far more straightforward than implementing wash trades. 
Liquidity measurements can be tricked using ghost orders: 
trades that appear on order books but disappear when engaged.

A recent Coindesk report featured 
a Russian college student who has set up a business that 
essentially helps exchanges fake their trading volumes 
by creating accounts manned by bots that trade constantly amongst themselves. 

Additionally, a recent Bloomberg report showed anomalies 
in the trading volume of Bitforex - a Singapore-based crypto exchange that 
has an incentive program linked to transaction fees. 

Users are offered $1.20 in digital tokens for every $1 of transaction fees. 
Users on the exchange used a similar scheme of multiple accounts and bots to increase trading volume, 
earning users tokens and Bitforex an impressive trading volume. 

Exchanges that score poorly according to one crypto data aggregator
appear in the top rankings of other crypto data aggregators,
indicating that some exchanges have found ways to adjust the data required to boost their rankings. 

Modern solutions that can combat fake volumes include decentralized oracles, which 
gather data from multiple sources and incentivizes data providers 
with tokens for reporting the truth. 
Using decentralized oracles could be the way forward, but 
until the technology can provide reliable service to integrate with enough platforms, 
how big of an impact they will make is still uncertain.

The current incentives that allow exchanges, 
data providers and tokens to take advantage of listing algorithms will be unsustainable in the long run. 
Today’s listing requirements and ranking mechanisms 
are detrimental to the growth of small projects and open avenues 
for manipulation from more influential players.

NEW links on the topic of exchange volume:
https://cointelegraph.com/news/telling-the-truth-how-crypto-data-aggregators-fight-fake-exchange-volumes
https://btiverified.com/#reports

One option to centralized exchanges are P2P exchanges
which are more secure but more expensive as they have less volume and so
higher transaction fees.
The pool of buyers and sellers in the market is limited. 
But that’s okay, I think it will grow bigger in the future.
However, even P2P Exchanges have been attacked of late.

The oldest P2P exchanges are:
Paxful and Localbitcoins,
they have been around long enough to know their business well.

Binance has 2 peer to peer exchanges:
Binance P2P, and it recently bought
Wazirx in India 

Some P2P exchanges are known for their top-notch security like:
Remitano in Singapore, but you pay for this with high fees.

You should know that
by and large, centralized exchanges obey know your client regulations, also known as
KYC regulations,
whereas
some P2P exchanges do not collect private user data:
HODL HODL.

One link on this topic:
https://coinsutra.com/p2p-exchange-platform/