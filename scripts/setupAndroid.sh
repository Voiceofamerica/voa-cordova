
export TERM=${TERM:-xterm}

echo "Checking if unzip is installed"
which unzip
if [[ $? != 0 ]]
then
  echo "Installing unzip"
  apt install unzip
else
  echo "Found unzip"
fi

if grep -q "export TERM=${TERM:-xterm}" "~/.bashrc"
then
  echo "export TERM=${TERM:-xterm}" >> ~/.bashrc
fi
