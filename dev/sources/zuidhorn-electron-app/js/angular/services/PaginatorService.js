municipalityApp.service('PaginatorService', [
    '$http',
    '$filter',
    '$timeout',
    'DeviceIdService',
    'ApiRequest',
    function(
        $http,
        $filter,
        $timeout,
        DeviceIdService,
        ApiRequest
    ) {
        return new(function() {
            var PaginationContainer = function(data, per_page, filter) {
                var self = this;

                self.data = data;
                self.per_page = per_page || 10;
                self.cur_page = 0;

                var getData = function() {
                    if (filter)
                        return $filter('filter')(self.data, filter);
                    return self.data;
                };

                var generatePages = function() {
                    var paginators = [];
                    var i = 0;
                    var page = Math.max(self.cur_page - 2, 0) + 1;

                    var makePage = function(page) {
                        return {
                            onClick: function(e) {
                                e && (e.preventDefault() & e.stopPropagation());
                                self.cur_page = (page - 1);
                                pages = generatePages();
                            },
                            isActive: function() {
                                return (page - 1) != self.cur_page;
                            },
                            pageNth: function() {
                                return page;
                            }
                        }
                    };

                    while (i < 5) {
                        if (((page + i) - 1) < Math.ceil(getData().length / self.per_page)) {
                            (function(page) {
                                paginators.push(makePage(page));
                            })((page + i));
                        }

                        i++;
                    }

                    if (paginators.length < 5) {
                        var count = 5 - paginators.length;

                        while ((count-- > 0) && ((paginators[0].pageNth() - 1) > 0)) {
                            (function(page) {
                                paginators.unshift(makePage(page));
                            })((paginators[0].pageNth() - 1));
                        }
                    }

                    return paginators;
                };

                var pages = generatePages();

                this.paginator = new(function() {
                    this.goFirst = function(e) {
                        e && (e.preventDefault() & e.stopPropagation());
                        self.cur_page = 0;
                        this.pages = generatePages();
                    };

                    this.pages = pages;

                    this.goLast = function(e) {
                        e && (e.preventDefault() & e.stopPropagation());
                        self.cur_page = Math.ceil(getData().length / self.per_page) - 1;
                        this.pages = generatePages();
                    };

                    this.curPage = function(e) {
                        return self.cur_page;
                    };

                    this.lastPage = function(e) {
                        return Math.ceil(getData().length / self.per_page) - 1;
                    };
                })()

                this.flow = function() {
                    var from = self.cur_page * self.per_page;

                    return getData().slice(from, from + self.per_page);
                };
            };
            this.make = function(rows, per_page) {
                return new PaginationContainer(rows, per_page)
            };
        });
    }
]);