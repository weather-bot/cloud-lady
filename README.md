# cloudlady

Cloud classification service for weather bot

rust, nodejs, python with tensorflow are required.

```sh
git clone https://github.com/weather-bot/cloudlady
cd cloudlady
npm install
# download model
wget https://github.com/weather-bot/cloudlady/releases/download/v0.0.0/retrained_graph.pb -P python/model
# download cats images
wget https://github.com/weather-bot/meow/releases/download/v0.0.1/cats.tar.gz
tar zxvf cats.tar.gz
# compile meow
git clone https://github.com/weather-bot/meow.git
cd meow
cargo build --release
cp ./target/release/meow ../meow
cd ..
# run
npm start
```
