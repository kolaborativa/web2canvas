"""
Python module for interacting with Gravatar.
"""
__author__  = 'Eric Seidel'
__version__ = '0.0.2'
__email__   = 'gridaphobe@gmail.com'

from urllib import urlencode
from urllib2 import urlopen
from hashlib import md5
import json

BASE_URL        = 'http://www.gravatar.com/avatar/'
SECURE_BASE_URL = 'https://secure.gravatar.com/avatar/'
PROFILE_URL     = 'http://www.gravatar.com/'
RATINGS         = ['g', 'pg', 'r', 'x']
MAX_SIZE        = 512
MIN_SIZE        = 1
DEFAULTS        = ['404', 'mm', 'identicon', 'monsterid', 'wavatar', 'retro']

class Gravatar(object):
    """
    Represents a Gravatar user.
    """
    
    def __init__(self, email, secure = False, rating = 'g', size = 80,
                 default = None):
        self._email_hash = md5(email.strip().lower()).hexdigest()
        self._secure     = secure
        self._rating     = rating
        self._size       = size
        self._default    = default
        self._thumb      = self._link_to_img()
        self._profile    = None
    
    @property
    def secure(self):
        """Return the secure parameter."""
        return self._secure
    
    @secure.setter
    def secure(self, value):
        """Set the secure parameter and regenerate the thumbnail link."""
        self._secure = value
        self._thumb  = self._link_to_img()
    
    @property
    def rating(self):
        """Return the rating parameter."""
        return self._rating

    @rating.setter
    def rating(self, value):
        """Set the rating parameter and regenerate the thumbnail link."""
        self._rating = value
        self._thumb  = self._link_to_img()

    @property
    def size(self):
        """Return the size parameter."""
        return self._size

    @size.setter
    def size(self, value):
        """Set the size parameter and regenerate the thumbnail link."""
        self._size   = value
        self._thumb  = self._link_to_img()

    @property
    def default(self):
        """Return the default parameter."""
        return self._default

    @default.setter
    def default(self, value):
        """Set the default parameter and regenerate the thumbnail link."""
        self._default = value
        self._thumb  = self._link_to_img()

    @property
    def thumb(self):
        """Return the link to the gravatar thumbnail."""
        return self._thumb
    
    def _link_to_img(self):
        """
        Generates a link to the user's Gravatar.
        
        >>> Gravatar('gridaphobe@gmail.com')._link_to_img()
        'http://www.gravatar.com/avatar/16b87da510d278999c892cdbdd55c1b6?s=80&r=g'
        """
        # make sure options are valid
        if self.rating.lower() not in RATINGS:
            raise InvalidRatingError(self.rating)
        if not (MIN_SIZE <= self.size <= MAX_SIZE):
            raise InvalidSizeError(self.size)
        
        url = ''
        if self.secure:
            url = SECURE_BASE_URL
        else:
            url = BASE_URL

        options = {'s' : self.size, 'r' : self.rating}
        if self.default is not None:
            options['d'] = self.default
        url += self.hash + '?' + urlencode(options)
        return url
    
    def _get_profile(self):
        """
        Retrieves the profile data of the user and formats it as a
        Python dictionary.
        """
        url = PROFILE_URL + self.hash + '.json'
        profile = json.load(urlopen(url))
        # set the profile as an instance variable
        self._profile = profile['entry'][0]
    
    @property
    def hash(self):
        """
        Return email hash.
        """
        return self._email_hash

    @property
    def profile(self):
        """
        Return the user's profile.
        """
        if self._profile is None:
            self._get_profile()
        return self._profile
    
    @property
    def urls(self):
        """
        Return a list of user's urls.
        """
        return self.profile['urls']
    
    @property
    def accounts(self):
        """
        Return a list of user's linked accounts.
        """
        return self.profile['accounts']
    
    @property
    def verified_accounts(self):
        """
        Return a list of user's verified accounts.
        """
        return [a for a in self.accounts if a['verified'] == 'true']
    
    @property
    def ims(self):
        """
        Return a list of user's IM accounts.
        """
        return self.profile['accounts']
    
    @property
    def photos(self):
        """
        Return a list of user's photos.
        """
        return self.profile['photos']
    
    @property
    def emails(self):
        """
        Return a list of user's emails.
        """
        return self.profile['emails']


class InvalidRatingError(Exception):
    def __init__(self, value):
        self.value = value
    def __str__(self):
        return self.value + " is not a valid gravatar rating"

class InvalidSizeError(Exception):
    def __init__(self, value):
        self.value = value
    def __str__(self):
        return self.value + " is not a valid image size"

##############################################################################
if __name__ == '__main__':
    import doctest
    doctest.testmod()